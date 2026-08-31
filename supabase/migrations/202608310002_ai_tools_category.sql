-- Migration: Unify AI categories into AI_TOOLS and update check constraint
-- Step 1: Drop old constraint first so updates/inserts won't be blocked
alter table public.bots drop constraint if exists bots_category_check;

-- Step 2: Update existing rows
update public.bots
set category = 'AI_TOOLS'
where category in ('AI', 'AI_GENERATOR', 'AI_GATEWAY', 'AI_COPILOT');

-- Step 3: Add new check constraint (supporting AI_TOOLS and legacy AI safely)
alter table public.bots add constraint bots_category_check 
  check (category in ('DOWNLOADER', 'AI', 'AI_TOOLS', 'ANON_CHAT', 'GAME', 'TOOLS', 'STORE'));
