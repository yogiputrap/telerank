import { MetadataRoute } from 'next';
import { INITIAL_BOTS } from '../lib/mockData';
import { getSupabaseAdmin, isSupabaseConfigured } from '../lib/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://telerank.com';
  const lastModified = new Date();

  // Static core routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}`,
      lastModified,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/statistik`,
      lastModified,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/aturan`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/new`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/tentang`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/terms`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ];

  // Dynamic bot profile routes
  let botUsernames: string[] = [];
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseAdmin();
      const { data } = await supabase.from('bots').select('telegram_username').eq('status', 'active').limit(500);
      if (data && data.length > 0) {
        botUsernames = data.map((b) => b.telegram_username);
      } else {
        botUsernames = INITIAL_BOTS.map((b) => b.telegram_username);
      }
    } catch {
      botUsernames = INITIAL_BOTS.map((b) => b.telegram_username);
    }
  } else {
    botUsernames = INITIAL_BOTS.map((b) => b.telegram_username);
  }

  const botRoutes: MetadataRoute.Sitemap = botUsernames.map((username) => ({
    url: `${siteUrl}/bot/${encodeURIComponent(username.toLowerCase())}`,
    lastModified,
    changeFrequency: 'daily',
    priority: 0.9,
  }));

  return [...staticRoutes, ...botRoutes];
}
