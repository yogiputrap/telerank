-- Migration: Update categories to Downloader, AI Chat, Games & Hiburan, Developer & AI API, Store & Topup
-- Step 1: Drop old constraint
alter table public.bots drop constraint if exists bots_category_check;

-- Step 2: Migrate existing category data to new standard
update public.bots
set category = 'AI_CHAT'
where category in ('AI', 'AI_TOOLS', 'AI_GENERATOR', 'AI_GATEWAY', 'AI_COPILOT');

update public.bots
set category = 'GAMES_HIBURAN'
where category in ('GAME', 'GAMES', 'ANON_CHAT');

update public.bots
set category = 'DEV_API'
where category in ('TOOLS', 'DEVELOPER', 'API');

update public.bots
set category = 'STORE_TOPUP'
where category in ('STORE', 'TOPUP');

-- Step 3: Add new check constraint
alter table public.bots add constraint bots_category_check 
  check (category in ('DOWNLOADER', 'AI_CHAT', 'GAMES_HIBURAN', 'DEV_API', 'STORE_TOPUP'));
