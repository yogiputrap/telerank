export type BotCategory = 'ALL' | 'DOWNLOADER' | 'AI' | 'ANON_CHAT' | 'GAME' | 'TOOLS' | 'STORE';

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
export const CATEGORY_LABELS: Record<BotCategory, string> = {
  ALL: 'Semua',
  DOWNLOADER: 'Downloader',
  AI: 'AI Copilot',
  ANON_CHAT: 'Anon Chat',
  GAME: 'Mini Apps',
  TOOLS: 'Developer & Tools',
  STORE: 'Store & Topup',
};

export const BOT_CATEGORIES: { id: BotCategory; label: string }[] = [
  { id: 'DOWNLOADER', label: 'Downloader' },
  { id: 'AI', label: 'AI Copilot' },
  { id: 'ANON_CHAT', label: 'Anon Chat' },
  { id: 'GAME', label: 'Mini Apps' },
  { id: 'TOOLS', label: 'Developer & Tools' },
  { id: 'STORE', label: 'Store & Topup' },
];
