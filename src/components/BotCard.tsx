'use client';

import Link from 'next/link';
import React from 'react';
import {
  MgcExternalLink,
  MgcEye,
  MgcCheckCircle,
  MgcTrophy,
} from './MingCuteIcons';
import { Bot, CATEGORY_LABELS } from '../types';

interface BotCardProps {
  rank: number;
  bot: Bot;
  onRebut: (bot: Bot, requiredAmount: number) => void;
}

export const BotCard: React.FC<BotCardProps> = ({
  rank,
  bot,
  onRebut,
}) => {
  const nextMinBid = bot.total_bid_amount + 1;
  const categoryDisplayName = CATEGORY_LABELS[bot.category] || bot.category;

  const isRank1 = rank === 1;
  const isRank2 = rank === 2;
  const isRank3 = rank === 3;

  // Clean, subtle differentiation without gaudy gradients
  let borderClass = 'border-[#e4ecf2] bg-white';
  let rankColorClass = 'text-[#707579]';

  if (isRank1) {
    borderClass = 'border-amber-300/80 bg-gradient-to-b from-amber-50/20 to-white shadow-xs';
    rankColorClass = 'text-amber-600 font-black';
  } else if (isRank2) {
    borderClass = 'border-slate-300 bg-white shadow-2xs';
    rankColorClass = 'text-slate-700 font-extrabold';
  } else if (isRank3) {
    borderClass = 'border-orange-200 bg-white shadow-2xs';
    rankColorClass = 'text-orange-700 font-extrabold';
  }

  return (
    <div
      className={`rounded-2xl border ${borderClass} p-4 sm:p-5 shadow-2xs hover:shadow-xs transition-all space-y-3 relative`}
    >
      {/* Top Header: Avatar + Title & Meta + Clean Rank Indicator */}
      <div className="flex items-start justify-between gap-3">
        {/* Left: Avatar + Title */}
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className="relative shrink-0">
            <img
              src={bot.avatar_url}
              alt={bot.bot_name}
              className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl object-cover border ${
                isRank1
                  ? 'border-amber-300'
                  : isRank2
                  ? 'border-slate-300'
                  : isRank3
                  ? 'border-orange-200'
                  : 'border-[#e4ecf2]'
              }`}
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
                {bot.is_verified && (
                  <MgcCheckCircle size={14} className="text-[#3390ec] shrink-0" />
                )}
                <MgcExternalLink
                  size={13}
                  className="text-[#707579] group-hover:text-[#3390ec] shrink-0"
                />
              </a>

              {/* Minimal Top Badges */}
              {isRank1 && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200/80 text-amber-700 text-[10px] font-bold">
                  <MgcTrophy size={11} />
                  <span>Top #1</span>
                </span>
              )}
              {isRank2 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-bold">
                  Top #2
                </span>
              )}
              {isRank3 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-orange-50 border border-orange-200 text-orange-800 text-[10px] font-bold">
                  Top #3
                </span>
              )}
            </div>

            {/* Badges: Price Pill + Username */}
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

        {/* Right: Big Rank Number */}
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

      {/* Action Bar: Consistent clean Telegram Primary Blue Button */}
      <div className="flex items-center gap-2 pt-1">
        <button
          type="button"
          onClick={() => onRebut(bot, nextMinBid)}
          className="flex-1 py-2.5 px-4 rounded-xl bg-[#3390ec] hover:bg-[#2481cc] active:scale-98 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
        >
          <span>{isRank1 ? 'Rebut Posisi #1' : isRank2 ? 'Rebut Posisi #2' : isRank3 ? 'Rebut Posisi #3' : 'Rebut posisi ini'}</span>
          <span className="font-mono font-black text-amber-200">
            Rp{nextMinBid.toLocaleString('id-ID')}
          </span>
        </button>

        <Link
          href={`/bot/${encodeURIComponent(bot.telegram_username.toLowerCase())}`}
          className="py-2.5 px-4 rounded-xl bg-[#f4f7fa] hover:bg-[#e8edf2] border border-[#e4ecf2] text-[#3390ec] font-bold text-xs transition-colors cursor-pointer shrink-0"
        >
          Detail
        </Link>
      </div>
    </div>
  );
};
