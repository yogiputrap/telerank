'use client';

import React from 'react';
import { Crown, Send, ArrowUpRight, Plus, Sparkles, ShieldCheck, Flame, Zap } from 'lucide-react';
import { MgcDownload, MgcBot, MgcMessage, MgcGamepad } from './MingCuteIcons';
import { Bot } from '../types';

interface HeroPodiumProps {
  topBots: Bot[];
  onOpenSubmitModal: () => void;
  onSelectBotForTopUp: (bot: Bot) => void;
}

export const HeroPodium: React.FC<HeroPodiumProps> = ({
  topBots,
  onOpenSubmitModal,
  onSelectBotForTopUp,
}) => {
  const rank1 = topBots[0];
  const rank2 = topBots[1];
  const rank3 = topBots[2];

  return (
    <div className="relative w-full rounded-2xl bg-white border border-slate-200/80 p-6 sm:p-8 md:p-10 shadow-sm overflow-hidden my-6">
      {/* Background Soft Pastel Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-teal-100/60 via-amber-100/40 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative flex flex-col lg:flex-row items-center justify-between gap-10">
        {/* Left: Heading & Intro */}
        <div className="flex-1 space-y-4 text-center lg:text-left">
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Peringkat Bot Telegram
            </h1>
            <span className="px-3 py-1 rounded-lg bg-teal-50 border border-teal-200 text-teal-700 text-xs font-bold">
              {topBots.length} Bot Terdaftar
            </span>
          </div>

          <p className="text-slate-500 text-xs sm:text-sm max-w-xl leading-relaxed">
            Temukan bot Telegram terbaik untuk download video, AI asisten, mini game, dan tools praktis.
            Daftarkan bot Anda dan rebut posisi teratas melalui lelang sponsor transparan via QRIS!
          </p>

          {/* Quick Category Badges */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1">
            <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition-colors flex items-center gap-1.5">
              <MgcDownload size={13} className="text-teal-600" />
              <span>Downloader</span>
            </span>
            <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition-colors flex items-center gap-1.5">
              <MgcBot size={13} className="text-sky-600" />
              <span>AI Copilot</span>
            </span>
            <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition-colors flex items-center gap-1.5">
              <MgcMessage size={13} className="text-amber-600" />
              <span>Anon Chat</span>
            </span>
            <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition-colors flex items-center gap-1.5">
              <MgcGamepad size={13} className="text-indigo-600" />
              <span>Mini Apps</span>
            </span>
          </div>

          {/* Action Link */}
          <div className="pt-2">
            <button
              onClick={onOpenSubmitModal}
              className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-bold text-xs sm:text-sm group cursor-pointer"
            >
              <div className="w-6 h-6 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus className="w-3.5 h-3.5" />
              </div>
              <span className="underline underline-offset-4">Daftarkan & promosikan bot kamu ke daftar ini</span>
            </button>
          </div>
        </div>

        {/* Right: 3D Top 3 Podium (Exact reference style) */}
        <div className="w-full lg:w-auto shrink-0 flex items-end justify-center gap-3 sm:gap-4 pt-6 lg:pt-0">
          {/* #2 Rank Podium (Soft Blue) */}
          {rank2 && (
            <div className="flex flex-col items-center group cursor-pointer" onClick={() => onSelectBotForTopUp(rank2)}>
              <div className="relative mb-2">
                <img
                  src={rank2.avatar_url}
                  alt={rank2.bot_name}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-3 border-white shadow-md group-hover:scale-105 transition-transform"
                />
                <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-lg bg-sky-500 text-white font-bold text-[10px] shadow">
                  #2
                </span>
              </div>
              <span className="text-[11px] font-bold text-slate-800 truncate max-w-[80px] sm:max-w-[100px] text-center">
                {rank2.bot_name.split(' ')[0]}
              </span>
              <span className="text-[10px] font-mono text-sky-700 font-semibold mb-2">
                Rp {(rank2.total_bid_amount / 1000).toFixed(0)}k
              </span>
              {/* Podium Cylinder */}
              <div className="w-20 sm:w-24 h-28 sm:h-32 rounded-t-2xl podium-2 flex flex-col items-center justify-start pt-3 border-t-2 border-white/60">
                <span className="text-white text-3xl sm:text-4xl font-black drop-shadow-sm opacity-90">2</span>
              </div>
            </div>
          )}

          {/* #1 Rank Podium (Golden Yellow - Tallest) */}
          {rank1 && (
            <div className="flex flex-col items-center group cursor-pointer" onClick={() => onSelectBotForTopUp(rank1)}>
              <div className="relative mb-2">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-amber-500 animate-bounce">
                  <Crown className="w-6 h-6 fill-amber-400" />
                </div>
                <img
                  src={rank1.avatar_url}
                  alt={rank1.bot_name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-4 border-amber-300 shadow-xl group-hover:scale-105 transition-transform"
                />
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.2 rounded-lg bg-amber-500 text-white font-extrabold text-[10px] uppercase tracking-wider shadow">
                  Raja #1
                </span>
              </div>
              <span className="text-xs font-bold text-slate-900 truncate max-w-[90px] sm:max-w-[120px] text-center mt-1">
                {rank1.bot_name.split(' ')[0]}
              </span>
              <span className="text-[11px] font-mono text-amber-800 font-black mb-2">
                Rp {(rank1.total_bid_amount / 1000).toFixed(0)}k
              </span>
              {/* Podium Cylinder */}
              <div className="w-24 sm:w-28 h-36 sm:h-42 rounded-t-2xl podium-1 flex flex-col items-center justify-start pt-3 border-t-2 border-white/80">
                <span className="text-white text-4xl sm:text-5xl font-black drop-shadow-md opacity-95">1</span>
              </div>
            </div>
          )}

          {/* #3 Rank Podium (Soft Coral/Orange) */}
          {rank3 && (
            <div className="flex flex-col items-center group cursor-pointer" onClick={() => onSelectBotForTopUp(rank3)}>
              <div className="relative mb-2">
                <img
                  src={rank3.avatar_url}
                  alt={rank3.bot_name}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-3 border-white shadow-md group-hover:scale-105 transition-transform"
                />
                <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-lg bg-orange-500 text-white font-bold text-[10px] shadow">
                  #3
                </span>
              </div>
              <span className="text-[11px] font-bold text-slate-800 truncate max-w-[80px] sm:max-w-[100px] text-center">
                {rank3.bot_name.split(' ')[0]}
              </span>
              <span className="text-[10px] font-mono text-orange-700 font-semibold mb-2">
                Rp {(rank3.total_bid_amount / 1000).toFixed(0)}k
              </span>
              {/* Podium Cylinder */}
              <div className="w-20 sm:w-24 h-22 sm:h-26 rounded-t-2xl podium-3 flex flex-col items-center justify-start pt-3 border-t-2 border-white/60">
                <span className="text-white text-3xl sm:text-4xl font-black drop-shadow-sm opacity-90">3</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
