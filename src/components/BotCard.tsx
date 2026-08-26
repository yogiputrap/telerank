'use client';

import React from 'react';
import { MgcExternalLink, MgcEye, MgcCheckCircle } from './MingCuteIcons';
import { Bot, CATEGORY_LABELS } from '../types';

interface BotCardProps {
  rank: number;
  bot: Bot;
  onRebut: (bot: Bot, requiredAmount: number) => void;
  onDetail: (bot: Bot) => void;
}

export const BotCard: React.FC<BotCardProps> = ({
  rank,
  bot,
  onRebut,
  onDetail,
}) => {
  const nextMinBid = bot.total_bid_amount + 1;

  // Telegram Rank Styling
  let rankColorClass = 'text-[#707579]';
  let cardBorderClass = 'border-[#e4ecf2]';

  if (rank === 1) {
    rankColorClass = 'text-[#3390ec] font-black';
    cardBorderClass = 'border-[#3390ec]/40 bg-gradient-to-b from-[#f7fbff] to-white';
  } else if (rank === 2) {
    rankColorClass = 'text-[#5ea5e6] font-extrabold';
  } else if (rank === 3) {
    rankColorClass = 'text-[#20a39e] font-extrabold';
  }

  const categoryDisplayName = CATEGORY_LABELS[bot.category] || bot.category;

  return (
    <div
      className={`rounded-2xl bg-white border ${cardBorderClass} p-4 sm:p-5 shadow-2xs hover:shadow-xs transition-all space-y-3`}
    >
      {/* Top Header: Avatar + Title & Meta + Big Rank # on right */}
      <div className="flex items-start justify-between gap-3">
        {/* Left: Avatar + Title */}
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className="relative shrink-0">
            <img
              src={bot.avatar_url}
              alt={bot.bot_name}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl object-cover border border-[#e4ecf2]"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#4cd964] border-2 border-white" />
          </div>

          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <a
                href={`https://t.me/${bot.telegram_username}?start=telerank`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-sm text-[#1c242b] hover:text-[#3390ec] transition-colors flex items-center gap-1 group truncate"
              >
                <span className="truncate">{bot.bot_name}</span>
                {bot.is_verified && <MgcCheckCircle size={14} className="text-[#3390ec] shrink-0" />}
                <MgcExternalLink size={13} className="text-[#707579] group-hover:text-[#3390ec] shrink-0" />
              </a>
            </div>

            {/* Badges: Price in Telegram Blue Pill + Status */}
            <div className="flex items-center gap-2 text-xs">
              <span className="font-mono font-bold text-[#3390ec] bg-[#eef5fc] border border-[#d2e5f8] px-2 py-0.5 rounded-lg text-[11px]">
                Rp{bot.total_bid_amount.toLocaleString('id-ID')}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] text-[#707579] bg-[#f4f7fa] px-1.5 py-0.5 rounded-md font-mono">
                @{bot.telegram_username}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Big Rank # in Telegram style */}
        <div className={`font-mono text-2xl sm:text-3xl tracking-tight shrink-0 select-none ${rankColorClass}`}>
          #{rank}
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-[#707579] leading-relaxed line-clamp-2">
        {bot.description}
      </p>

      {/* Metadata Row: Category • Clicks • Time */}
      <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#707579] pt-0.5">
        <span className="px-2 py-0.5 rounded-md bg-[#eef5fc] text-[#3390ec] font-bold text-[10px]">
          {categoryDisplayName}
        </span>
        <span>•</span>
        <span className="flex items-center gap-1 font-medium">
          <MgcEye size={12} className="text-[#3390ec]" />
          <span>{bot.daily_clicks} klik</span>
        </span>
        <span>•</span>
        <span>Aktif 24 jam</span>
      </div>

      {/* Action Bar: Telegram Primary Blue Rebut Button + Outline Detail Button */}
      <div className="flex items-center gap-2 pt-1">
        <button
          type="button"
          onClick={() => onRebut(bot, nextMinBid)}
          className="flex-1 py-2.5 px-4 rounded-xl bg-[#3390ec] hover:bg-[#2481cc] active:scale-98 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
        >
          <span>Rebut posisi ini</span>
          <span className="font-mono font-black text-amber-200">
            Rp{nextMinBid.toLocaleString('id-ID')}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onDetail(bot)}
          className="py-2.5 px-4 rounded-xl bg-[#f4f7fa] hover:bg-[#e8edf2] border border-[#e4ecf2] text-[#3390ec] font-bold text-xs transition-colors cursor-pointer shrink-0"
        >
          Detail
        </button>
      </div>
    </div>
  );
};
