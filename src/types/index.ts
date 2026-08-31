export type BotCategory =
  | 'ALL'
  | 'DOWNLOADER'
  | 'AI_CHAT'
  | 'GAMES_HIBURAN'
  | 'DEV_API'
  | 'STORE_TOPUP';

export interface Bot {
  id: string;
  rank?: number;
  telegram_username: string;
  bot_name: string;
  avatar_url: string;
  description: string;
  category: BotCategory;
  custom_tagline?: string;
  current_sponsor_amount?: number;
  total_bid_amount: number;
  contact_handle?: string;
  is_verified?: boolean;
  is_online?: boolean;
  daily_clicks: number;
  created_at: string;
  sponsor_updated_at?: string;
}

export interface OutbidNotification {
  id: string;
  bot_name: string;
  telegram_username: string;
  avatar_url?: string;
  old_rank: number;
  new_rank: number;
  amount_added: number;
  timestamp: string;
}

// Single Source of Truth for Exact Category Names across the entire app
export const CATEGORY_LABELS: Record<string, string> = {
  ALL: 'Semua',
  DOWNLOADER: 'Downloader',
  AI_CHAT: 'AI Chat',
  GAMES_HIBURAN: 'Games & Hiburan',
  DEV_API: 'Developer & AI API',
  STORE_TOPUP: 'Store & Topup',
  // Backward compatibility mappings
  AI_TOOLS: 'AI Chat',
  ANON_CHAT: 'Games & Hiburan',
  GAME: 'Games & Hiburan',
  TOOLS: 'Developer & AI API',
  STORE: 'Store & Topup',
};

export const BOT_CATEGORIES: { id: BotCategory; label: string }[] = [
  { id: 'DOWNLOADER', label: 'Downloader' },
  { id: 'AI_CHAT', label: 'AI Chat' },
  { id: 'GAMES_HIBURAN', label: 'Games & Hiburan' },
  { id: 'DEV_API', label: 'Developer & AI API' },
  { id: 'STORE_TOPUP', label: 'Store & Topup' },
];
