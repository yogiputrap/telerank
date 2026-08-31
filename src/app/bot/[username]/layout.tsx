import type { Metadata } from 'next';
import React from 'react';
import { INITIAL_BOTS } from '../../../lib/mockData';
import { getSupabaseAdmin, isSupabaseConfigured } from '../../../lib/supabase/server';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://telerank.com';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const cleanUsername = decodeURIComponent(username).toLowerCase().replace(/^@/, '');

  let botName = `@${cleanUsername}`;
  let description = `Profil, ulasan, statistik performa, dan informasi sponsor resmi bot Telegram @${cleanUsername} di TeleRank.`;

  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseAdmin();
      const { data } = await supabase.from('bots').select('bot_name, description').eq('telegram_username', cleanUsername).maybeSingle();
      if (data) {
        botName = data.bot_name;
        if (data.description) description = data.description;
      }
    } catch {
      const found = INITIAL_BOTS.find((b) => b.telegram_username.toLowerCase() === cleanUsername);
      if (found) {
        botName = found.bot_name;
        if (found.description) description = found.description;
      }
    }
  } else {
    const found = INITIAL_BOTS.find((b) => b.telegram_username.toLowerCase() === cleanUsername);
    if (found) {
      botName = found.bot_name;
      if (found.description) description = found.description;
    }
  }

  const title = `${botName} (@${cleanUsername})`;
  const canonicalUrl = `${siteUrl}/bot/${encodeURIComponent(cleanUsername)}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: 'website',
      locale: 'id_ID',
      url: canonicalUrl,
      siteName: 'TeleRank',
      title: `${title} | TeleRank`,
      description,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | TeleRank`,
      description,
      creator: '@telerank',
    },
  };
}

export default function BotDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
