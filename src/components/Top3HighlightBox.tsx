'use client';

import React from 'react';
import { MgcTelegram, MgcEye, MgcArrowRight, MgcExternalLink } from './MingCuteIcons';
import { Bot } from '../types';

interface Top3HighlightBoxProps {
  topBots: Bot[];
  onSelectBotForTopUp: (bot: Bot) => void;
}

export const Top3HighlightBox: React.FC<Top3HighlightBoxProps> = ({
  topBots,
  onSelectBotForTopUp,
}) => {
  if (topBots.length === 0) return null;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 my-2">
      <div className="rounded-3xl bg-[#fefcf3] border border-amber-200/80 p-5 sm:p-7 shadow-xs space-y-4">
        {/* Top 3 Rows */}
        <div className="divide-y divide-amber-100">
          {topBots.map((bot, index) => {
            const rankStr = `0${index + 1}`;
            return (
              <div
                key={bot.id}
                className="py-4 first:pt-0 last:pb-0 flex items-start sm:items-center justify-between gap-4 group"
              >
                {/* Left: Rank + Avatar + Details */}
                <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
                  {/* Rank Badge */}
                  <div className="w-8 h-8 rounded-xl bg-amber-100/80 border border-amber-300 text-amber-800 font-extrabold text-xs flex items-center justify-center shrink-0">
                    {rankStr}
                  </div>

                  {/* Avatar */}
                  <img
                    src={bot.avatar_url}
                    alt={bot.bot_name}
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl object-cover border border-amber-200 shrink-0"
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
                      <span className="uppercase font-bold text-amber-700">{bot.category}</span>
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

                {/* Right: Price & CTA */}
                <div className="text-right shrink-0">
                  <div className="text-sm font-extrabold font-mono text-slate-900">
                    Rp {bot.total_bid_amount.toLocaleString('id-ID')}
                  </div>
                  <button
                    onClick={() => onSelectBotForTopUp(bot)}
                    className="text-[11px] text-amber-700 hover:text-amber-900 font-bold flex items-center justify-end gap-0.5 mt-0.5 cursor-pointer"
                  >
                    <span>Salip detail</span>
                    <MgcArrowRight size={12} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Review Zone Banner (Matching bottom of yellow box in screenshot) */}
        <div className="mt-4 pt-4 border-t border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="px-2 py-0.5 rounded bg-amber-200/90 text-amber-900 font-black text-[10px] uppercase tracking-wider">
              REVIEW ZONE
            </span>
            <span className="text-slate-600 text-xs font-medium">
              Top 3 akan dipromosikan ke channel Telegram <strong>@telerank_id</strong> ↗
            </span>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-1.5 font-mono text-center">
            <div className="px-2 py-1 bg-amber-100 rounded-lg text-slate-800 font-bold text-xs">
              09<span className="block text-[8px] text-slate-500 font-normal">HARI</span>
            </div>
            <div className="px-2 py-1 bg-amber-100 rounded-lg text-slate-800 font-bold text-xs">
              23<span className="block text-[8px] text-slate-500 font-normal">JAM</span>
            </div>
            <div className="px-2 py-1 bg-amber-100 rounded-lg text-slate-800 font-bold text-xs">
              45<span className="block text-[8px] text-slate-500 font-normal">MENIT</span>
            </div>
            <div className="px-2 py-1 bg-amber-100 rounded-lg text-slate-800 font-bold text-xs">
              15<span className="block text-[8px] text-slate-500 font-normal">DETIK</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
