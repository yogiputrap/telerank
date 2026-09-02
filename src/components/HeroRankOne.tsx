'use client';

import React from 'react';
import { Crown, Send, Flame, ShieldCheck, ArrowUpRight, Award, Zap } from 'lucide-react';
import { Bot } from '../types';

interface HeroRankOneProps {
  bot?: Bot;
  onOutbidRankOne: () => void;
}

export const HeroRankOne: React.FC<HeroRankOneProps> = ({ bot, onOutbidRankOne }) => {
  if (!bot) return null;

  return (
    <div className="relative w-full max-w-5xl mx-auto my-6 px-4">
      {/* Background Ambient Glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 via-yellow-500/30 to-amber-600/20 rounded-2xl blur-2xl opacity-70 pointer-events-none" />

      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900/95 via-[#111927] to-[#0f172a] border-2 border-amber-500/50 gold-glow p-6 sm:p-8 md:p-10 shadow-2xl">
        {/* Decorative Crown Banner */}
        <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          {/* Left: Rank & Avatar */}
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left flex-1">
            <div className="relative group shrink-0">
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-amber-400/80 shadow-xl shadow-amber-500/20 bg-slate-800">
                <img
                  src={bot.avatar_url}
                  alt={bot.bot_name}
                  onError={(e) => {
                    const target = e.currentTarget;
                    const fallback = `https://api.dicebear.com/7.x/bottts/svg?seed=${bot.telegram_username || bot.bot_name || 'bot'}`;
                    if (target.src !== fallback) target.src = fallback;
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              {/* Crown Badge */}
              <div className="absolute -top-3.5 -right-3.5 bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 p-1.5 rounded-xl shadow-lg border border-amber-200 animate-bounce">
                <Crown className="w-5 h-5 fill-slate-950" />
              </div>
              {/* Rank #1 Chip */}
              <div className="absolute -bottom-2.5 left-1/2 transform -translate-x-1/2 px-3 py-0.5 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs uppercase tracking-widest shadow-md flex items-center gap-1">
                <Award className="w-3 h-3" /> #1 TAHTA
              </div>
            </div>

            {/* Info */}
            <div className="space-y-2 max-w-xl">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> Raja Papan Peringkat
                </span>
                <span className="px-2.5 py-0.5 rounded-lg bg-sky-500/15 border border-sky-500/30 text-sky-300 text-xs font-medium">
                  Kategori: {bot.category}
                </span>
                {bot.is_verified && (
                  <span className="px-2 py-0.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" /> Terverifikasi
                  </span>
                )}
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center justify-center sm:justify-start gap-2">
                {bot.bot_name}
              </h2>

              <p className="text-xs sm:text-sm font-mono text-sky-400 font-semibold">
                @{bot.telegram_username}
              </p>

              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed line-clamp-2">
                {bot.description}
              </p>

              {bot.custom_tagline && (
                <div className="inline-block px-3 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-amber-200/90 text-xs font-medium">
                  {bot.custom_tagline}
                </div>
              )}
            </div>
          </div>

          {/* Right: Total Bid & Action Buttons */}
          <div className="flex flex-col items-center md:items-end gap-4 w-full md:w-auto shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-800">
            <div className="text-center md:text-right bg-slate-950/60 p-3.5 rounded-2xl border border-amber-500/30 w-full md:w-auto">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
                Akumulasi Sponsor Posisi #1
              </span>
              <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono tracking-tight">
                Rp {bot.total_bid_amount.toLocaleString('id-ID')}
              </div>
              <span className="text-[10px] text-emerald-400 font-medium flex items-center justify-center md:justify-end gap-1 mt-0.5">
                <Zap className="w-3 h-3" /> ~{bot.daily_clicks.toLocaleString('id-ID')} Total Klik Pengunjung
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full">
              <a
                href={`https://t.me/${bot.telegram_username}?start=telerank`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-sky-500/25 active:scale-95 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Buka di Telegram</span>
                <ArrowUpRight className="w-4 h-4 text-sky-200" />
              </a>

              <button
                onClick={onOutbidRankOne}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
              >
                <Flame className="w-4 h-4 fill-slate-950" />
                <span>Rebut Tahta #1</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
