import { NextResponse } from 'next/server';
import { getSupabaseAdmin, isSupabaseConfigured } from '../../../lib/supabase/server';
import { getClientKey, isRateLimited, jsonTooLarge } from '../../../lib/rate-limit';
import { createPaykitaOrder, isPaykitaConfigured } from '../../../lib/paykita';
import { sanitizeText, isValidHttpsUrl } from '../../../lib/sanitize';

export async function POST(request: Request) {
  if (jsonTooLarge(request)) return NextResponse.json({ error: 'PAYLOAD_TOO_LARGE' }, { status: 413 });
  if (isRateLimited(`order:${getClientKey(request)}`, 10, 10 * 60_000)) return NextResponse.json({ error: 'RATE_LIMITED' }, { status: 429 });
  if (!isSupabaseConfigured()) return NextResponse.json({ error: 'BACKEND_UNAVAILABLE' }, { status: 503 });
  try {
    const body = await request.json();
    const username = String(body.telegramUsername || '').replace(/^https?:\/\/t\.me\//, '').replace(/^@/, '').trim().toLowerCase();
    const botName = sanitizeText(String(body.botName || ''));
    const amount = Number(body.amount);
    let category = String(body.category || 'DOWNLOADER').toUpperCase().trim();
    if (['AI', 'AI_GENERATOR', 'AI_GATEWAY', 'AI_COPILOT', 'AI_TOOLS', 'AI_CHAT'].includes(category)) {
      category = 'AI_CHAT';
    } else if (['GAME', 'GAMES', 'ANON_CHAT', 'GAMES_HIBURAN'].includes(category)) {
      category = 'GAMES_HIBURAN';
    } else if (['TOOLS', 'DEVELOPER', 'API', 'DEV_API'].includes(category)) {
      category = 'DEV_API';
    } else if (['STORE', 'TOPUP', 'STORE_TOPUP'].includes(category)) {
      category = 'STORE_TOPUP';
    }
    const description = sanitizeText(String(body.description || ''));
    const allowedCategories = ['DOWNLOADER', 'AI_CHAT', 'GAMES_HIBURAN', 'DEV_API', 'STORE_TOPUP'];
    const fieldErrors: string[] = [];
    if (!username || !/^[a-zA-Z0-9_]{5,32}$/.test(username) || !/bot$/i.test(username)) fieldErrors.push('telegramUsername');
    if (!botName || botName.length > 120) fieldErrors.push('botName');
    if (!Number.isSafeInteger(amount) || amount < 1000 || amount > 9_000_000_000_000) fieldErrors.push('amount');
    if (description.length > 150) fieldErrors.push('description');
    if (!allowedCategories.includes(category)) fieldErrors.push('category');
    if (fieldErrors.length) {
      console.error('POST /api/orders validation failed', { fields: fieldErrors, username, botName, amount, category, descriptionLength: description.length });
      return NextResponse.json({ error: 'VALIDATION_ERROR', fields: fieldErrors }, { status: 400 });
    }
    const supabase = getSupabaseAdmin();
    const { data: existing } = await supabase.from('bots').select('id,current_sponsor_amount').eq('telegram_username', username).maybeSingle();
    if (existing && amount <= existing.current_sponsor_amount) return NextResponse.json({ error: 'AMOUNT_MUST_INCREASE' }, { status: 409 });

    const rawAvatar = String(body.avatarUrl || '').trim();
    const avatarUrl = isValidHttpsUrl(rawAvatar) && !rawAvatar.includes('telesco.pe')
      ? rawAvatar
      : `/api/avatar/${username}`;

    const { data: order, error: insertError } = await supabase.from('payment_orders').insert({
      bot_id: existing?.id ?? null,
      purpose: existing ? 'replace_sponsor' : 'listing',
      telegram_username: username,
      amount,
      target_amount: existing?.current_sponsor_amount ?? null,
      draft_data: existing ? null : { bot_name: botName, category, description, avatar_url: avatarUrl },
      provider: isPaykitaConfigured() ? 'paykita' : 'sandbox',
    }).select('id,public_id,amount').single();
    if (insertError) throw insertError;

    if (!isPaykitaConfigured()) {
      const { data: sandboxOrder, error: sandboxError } = await supabase.from('payment_orders').update({
        pay_amount: amount,
        qris_string: `sandbox:${order.public_id}`,
      }).eq('id', order.id).select('public_id,amount,pay_amount,qris_string,checkout_url,expires_at').single();
      if (sandboxError) throw sandboxError;
      return NextResponse.json({
        data: {
          public_id: sandboxOrder.public_id,
          amount: sandboxOrder.amount,
          pay_amount: sandboxOrder.pay_amount,
          qris: sandboxOrder.qris_string,
          checkout_url: sandboxOrder.checkout_url,
          expires_at: sandboxOrder.expires_at,
          sandbox: true,
        },
      }, { status: 201 });
    }

    const appBaseUrl = (process.env.APP_BASE_URL || process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || '').replace(/\/$/, '');
    try {
      const paykitaOrder = await createPaykitaOrder({
        baseAmount: amount,
        reference: order.public_id,
        webhookUrl: appBaseUrl?.startsWith('https://') ? `${appBaseUrl}/api/payments/webhook` : undefined,
      });
      const { data: updated, error: updateError } = await supabase.from('payment_orders').update({
        provider_order_id: paykitaOrder.id,
        pay_amount: paykitaOrder.pay_amount,
        checkout_url: paykitaOrder.checkout_url,
        qris_string: paykitaOrder.qris,
        expires_at: paykitaOrder.expires_at,
      }).eq('id', order.id).select('public_id,amount,pay_amount,qris_string,checkout_url,expires_at').single();
      if (updateError) throw updateError;
      return NextResponse.json({
        data: {
          public_id: updated.public_id,
          amount: updated.amount,
          pay_amount: updated.pay_amount,
          qris: updated.qris_string,
          checkout_url: updated.checkout_url,
          expires_at: updated.expires_at,
          sandbox: false,
        },
      }, { status: 201 });
    } catch (paykitaError) {
      await supabase.from('payment_orders').update({ status: 'failed' }).eq('id', order.id);
      console.error('PayKita createOrder failed', paykitaError);
      return NextResponse.json({ error: 'PAYMENT_PROVIDER_UNAVAILABLE' }, { status: 502 });
    }
  } catch (error) {
    console.error('POST /api/orders failed', error);
    return NextResponse.json({ error: 'BACKEND_UNAVAILABLE' }, { status: 503 });
  }
}
