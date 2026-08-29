import { createHmac, timingSafeEqual } from 'node:crypto';

export function isPaykitaConfigured(): boolean {
  return Boolean(process.env.PAYKITA_API_KEY);
}

function getBaseUrl() {
  return process.env.PAYKITA_BASE_URL || 'https://pay.digikita.id';
}

function getApiKey() {
  const key = process.env.PAYKITA_API_KEY;
  if (!key) throw new Error('PayKita is not configured');
  return key;
}

async function paykitaRequest(path: string, init: RequestInit) {
  let response: Response;
  try {
    response = await fetch(`${getBaseUrl()}${path}`, {
      ...init,
      headers: { 'x-api-key': getApiKey(), 'content-type': 'application/json', ...init.headers },
    });
  } catch (error) {
    console.error(`PayKita request failed: ${path}`, error);
    throw new Error('PAYKITA_REQUEST_FAILED');
  }
  const body = await response.json().catch(() => null);
  if (!response.ok || !body?.ok) {
    console.error(`PayKita request rejected: ${path}`, body?.error);
    throw new Error('PAYKITA_REQUEST_FAILED');
  }
  return body.data;
}

export interface PaykitaOrder {
  id: string;
  reference: string | null;
  base_amount: number;
  pay_amount: number;
  status: 'pending' | 'paid' | 'expired' | 'cancelled';
  qris: string;
  checkout_url: string;
  expires_at: string;
  paid_at: string | null;
}

export function createPaykitaOrder(params: {
  baseAmount: number;
  reference: string;
  webhookUrl?: string;
  redirectUrl?: string;
  ttlSeconds?: number;
}): Promise<PaykitaOrder> {
  return paykitaRequest('/api/orders', {
    method: 'POST',
    body: JSON.stringify({
      base_amount: params.baseAmount,
      reference: params.reference,
      webhook_url: params.webhookUrl,
      redirect_url: params.redirectUrl,
      ttl_seconds: params.ttlSeconds,
    }),
  });
}

export function getPaykitaOrder(providerOrderId: string): Promise<PaykitaOrder> {
  return paykitaRequest(`/api/orders/${encodeURIComponent(providerOrderId)}`, { method: 'GET' });
}

const MAX_SIGNATURE_AGE_SECONDS = 5 * 60;

export function verifyPaykitaSignature(rawBody: string, timestampHeader: string | null, signatureHeader: string | null): boolean {
  const secret = process.env.PAYKITA_WEBHOOK_SECRET;
  if (!secret || !timestampHeader || !signatureHeader) return false;

  const timestamp = Number(timestampHeader);
  if (!Number.isFinite(timestamp) || Math.abs(Date.now() / 1000 - timestamp) > MAX_SIGNATURE_AGE_SECONDS) return false;

  const expected = createHmac('sha256', secret).update(`${timestampHeader}.${rawBody}`).digest('hex');
  const provided = signatureHeader.startsWith('v1=') ? signatureHeader.slice(3) : signatureHeader;

  const expectedBuf = Buffer.from(expected, 'hex');
  const providedBuf = Buffer.from(provided, 'hex');
  if (expectedBuf.length !== providedBuf.length) return false;
  return timingSafeEqual(expectedBuf, providedBuf);
}
