'use client';

import React from 'react';
import { MgcEye, MgcArrowRight } from './MingCuteIcons';
import { Bot } from '../types';

interface LeaderboardListProps {
  bots: Bot[];
  onSelectBotForTopUp: (bot: Bot) => void;
}

export const LeaderboardList: React.FC<LeaderboardListProps> = ({
  bots,
  onSelectBotForTopUp,
}) => {
  if (bots.length === 0) return null;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 my-2">
      <div className="divide-y divide-slate-100 bg-white rounded-3xl border border-slate-200/80 px-5 sm:px-7 shadow-xs">
        {bots.map((bot, index) => {
          const rank = index + 4; // since Top 3 are shown above
          const rankStr = rank < 10 ? `0${rank}` : `${rank}`;

          return (
            <div
              key={bot.id}
              className="py-4 flex items-start sm:items-center justify-between gap-4 group"
            >
              {/* Left: Rank + Avatar + Details */}
              <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
                {/* Rank Badge */}
                <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 font-extrabold text-xs flex items-center justify-center shrink-0">
                  {rankStr}
                </div>

                {/* Avatar */}
                <img
                  src={bot.avatar_url}
                  alt={bot.bot_name}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl object-cover border border-slate-200 shrink-0"
                />

                {/* Info */}
                <div className="min-w-0 flex-1 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-slate-900 truncate">
                      {bot.bot_name}
                    </h4>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-1 leading-relaxed">
                    {bot.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 text-[10px] font-medium text-slate-400 pt-0.5">
                    <span className="uppercase font-bold text-slate-600">{bot.category}</span>
                    <span>•</span>
                    <a
                      href={`https://t.me/${bot.telegram_username}?start=telerank`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-500 hover:text-slate-800 font-mono"
                    >
                      @{bot.telegram_username}
                    </a>
                    <span>•</span>
                    <span className="flex items-center gap-0.5 text-slate-500">
                      <MgcEye size={12} /> {bot.daily_clicks} KLIK
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Price & Detail link */}
              <div className="text-right shrink-0">
                <div className="text-sm font-extrabold font-mono text-slate-900">
                  Rp {bot.total_bid_amount.toLocaleString('id-ID')}
                </div>
                <button
                  onClick={() => onSelectBotForTopUp(bot)}
                  className="text-[11px] text-slate-500 hover:text-amber-600 font-semibold flex items-center justify-end gap-0.5 mt-0.5 cursor-pointer"
                >
                  <span>Lihat detail</span>
                  <MgcArrowRight size={12} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
