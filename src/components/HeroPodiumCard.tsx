'use client';

import React, { useRef } from 'react';
import { MgcAdd } from './MingCuteIcons';
import { Bot, BOT_CATEGORIES } from '../types';
import confetti from 'canvas-confetti';

interface HeroPodiumCardProps {
  topBots: Bot[];
  onOpenSubmit: () => void;
  onSelectBot: (bot: Bot) => void;
}

export const HeroPodiumCard: React.FC<HeroPodiumCardProps> = ({
  topBots,
  onOpenSubmit,
  onSelectBot,
}) => {
  const bot1 = topBots[0];
  const bot2 = topBots[1];
  const bot3 = topBots[2];

  const cardRef = useRef<HTMLDivElement>(null);
  const lastCelebration = useRef<number>(0);

  const fireCelebration = (e?: React.MouseEvent) => {
    const now = Date.now();
    // Cooldown 2 seconds to keep it smooth
    if (now - lastCelebration.current < 2000) return;
    lastCelebration.current = now;

    let originX = 0.65;
    let originY = 0.35;

    if (e && cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      originX = (rect.left + rect.width * 0.7) / window.innerWidth;
      originY = (rect.top + rect.height * 0.4) / window.innerHeight;
    }

    try {
      // 1. Telegram Blue & Gold Ribbon Burst
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { x: originX, y: originY },
        colors: ['#3390ec', '#5ea5e6', '#ffd166', '#06d6a0', '#118ab2', '#ffffff'],
        ticks: 180,
        gravity: 0.9,
        scalar: 0.85,
        drift: 0,
      });

      // 2. Secondary Mini Sparkles
      setTimeout(() => {
        confetti({
          particleCount: 25,
          angle: 90,
          spread: 80,
          origin: { x: originX, y: originY - 0.05 },
          colors: ['#ffd166', '#3390ec', '#ffffff'],
          ticks: 150,
          gravity: 1.1,
          scalar: 0.6,
        });
      }, 150);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePodiumClick = (e: React.MouseEvent, bot: Bot) => {
    e.stopPropagation();
    fireCelebration(e);
    onSelectBot(bot);
  };

  return (
    <div className="w-full max-w-3xl mx-auto my-3">
      <div
        ref={cardRef}
        onMouseEnter={(e) => fireCelebration(e)}
        className="relative rounded-3xl bg-white border border-[#e4ecf2] p-5 sm:p-7 md:p-8 shadow-xs overflow-hidden transition-all duration-300 hover:shadow-md hover:border-[#3390ec]/30 group cursor-default"
      >
        {/* Telegram Soft Blue Ambient Gradient Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#eef5fc] via-[#e4f0fa]/80 to-transparent rounded-full blur-2xl pointer-events-none transition-transform duration-700 group-hover:scale-110" />

        <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-10">
          {/* Left Column: Heading & Topic Tags (100% Identik dengan Homepage) */}
          <div className="space-y-3 flex-1 text-left">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-[#1c242b] tracking-tight">
                Top Telegram Bots
              </h1>
            </div>

            <p className="text-[#707579] text-xs sm:text-sm max-w-sm leading-relaxed">
              Katalog bot Telegram terbaik se-Indonesia. Promosikan bot kamu ke peringkat teratas dengan sistem sponsor transparan!
            </p>

            {/* Telegram Style Topic Badges with Identical Names */}
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              {BOT_CATEGORIES.slice(0, 4).map((cat) => (
                <span
                  key={cat.id}
                  className="px-3 py-1 rounded-full bg-[#eef5fc] text-[#3390ec] text-xs font-semibold"
                >
                  {cat.label}
                </span>
              ))}
            </div>

            {/* Action Button: Single neat plus icon */}
            <div className="pt-1.5">
              <button
                type="button"
                onClick={onOpenSubmit}
                className="inline-flex items-center gap-1.5 text-[#3390ec] hover:text-[#2481cc] font-bold text-xs sm:text-sm group cursor-pointer transition-colors"
              >
                <MgcAdd size={16} className="group-hover:rotate-90 transition-transform duration-200" />
                <span>Daftarkan bot ke daftar ini</span>
              </button>
            </div>
          </div>

          {/* Right Column: 3D Top 3 Podium Cylinders in Telegram Colors */}
          <div className="shrink-0 flex items-end justify-center gap-2.5 sm:gap-3.5 pt-2 md:pt-0">
            {/* Rank 2 (Left, Sky Blue) */}
            {bot2 ? (
              <div
                className="flex flex-col items-center group/p2 cursor-pointer transition-transform duration-200 hover:-translate-y-1.5"
                onClick={(e) => handlePodiumClick(e, bot2)}
                title={`Klik untuk rebut #${2} ${bot2.bot_name}`}
              >
                <div className="relative mb-1.5">
                  <img
                    src={bot2.avatar_url}
                    alt={bot2.bot_name}
                    className="w-11 h-11 sm:w-13 sm:h-13 rounded-full object-cover border-2 border-white shadow-md group-hover/p2:ring-2 group-hover/p2:ring-[#a2d2ff]"
                  />
                </div>
                <span className="text-[10px] sm:text-[11px] font-bold text-[#1c242b] truncate max-w-[70px] sm:max-w-[85px] text-center mb-1">
                  {bot2.bot_name.split(' ')[0]}
                </span>
                {/* 3D Cylinder Body */}
                <div className="w-16 sm:w-20 h-24 sm:h-28 rounded-t-2xl bg-gradient-to-b from-[#bde0fe] via-[#a2d2ff] to-[#80beea] flex flex-col items-center justify-start pt-2 border-t-2 border-white/80 shadow-md shadow-blue-200/30">
                  <span className="text-white text-2xl sm:text-3xl font-black drop-shadow-xs opacity-95">
                    2
                  </span>
                </div>
              </div>
            ) : (
              <div
                className="flex flex-col items-center group/p2 cursor-pointer transition-transform duration-200 hover:-translate-y-1"
                onClick={onOpenSubmit}
                title="Klaim Posisi #2"
              >
                <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-full border-2 border-dashed border-[#a2d2ff] bg-white/70 flex items-center justify-center text-slate-400 mb-1.5 shadow-2xs group-hover/p2:border-[#3390ec] group-hover/p2:text-[#3390ec]">
                  <MgcAdd size={16} />
                </div>
                <span className="text-[10px] font-bold text-[#707579] mb-1">
                  Klaim #2
                </span>
                <div className="w-16 sm:w-20 h-24 sm:h-28 rounded-t-2xl bg-gradient-to-b from-[#e4f0fa] to-[#d2e5f8] flex flex-col items-center justify-start pt-2 border-t border-dashed border-[#a2d2ff]">
                  <span className="text-[#3390ec]/60 text-2xl sm:text-3xl font-black">
                    2
                  </span>
                </div>
              </div>
            )}

            {/* Rank 1 (Center, Telegram Vibrant Blue - Tallest) */}
            {bot1 ? (
              <div
                className="flex flex-col items-center group/p1 cursor-pointer transition-transform duration-200 hover:-translate-y-2"
                onClick={(e) => handlePodiumClick(e, bot1)}
                title={`Klik untuk rebut #${1} ${bot1.bot_name}`}
              >
                <div className="relative mb-1.5">
                  <img
                    src={bot1.avatar_url}
                    alt={bot1.bot_name}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-3 border-[#3390ec] shadow-lg group-hover/p1:scale-105 transition-transform"
                  />
                </div>
                <span className="text-xs font-black text-[#1c242b] truncate max-w-[85px] sm:max-w-[100px] text-center mb-1">
                  {bot1.bot_name.split(' ')[0]}
                </span>
                {/* 3D Cylinder Body */}
                <div className="w-20 sm:w-24 h-32 sm:h-38 rounded-t-2xl bg-gradient-to-b from-[#3390ec] via-[#2481cc] to-[#1c6fb3] flex flex-col items-center justify-start pt-2.5 border-t-2 border-white/80 shadow-lg shadow-blue-400/40">
                  <span className="text-white text-3xl sm:text-4xl font-black drop-shadow-md opacity-95">
                    1
                  </span>
                </div>
              </div>
            ) : (
              <div
                className="flex flex-col items-center group/p1 cursor-pointer transition-transform duration-200 hover:-translate-y-1.5"
                onClick={onOpenSubmit}
                title="Klaim Posisi #1 Teratas"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-dashed border-[#3390ec] bg-white flex items-center justify-center text-[#3390ec] mb-1.5 shadow-md group-hover/p1:scale-105 transition-transform">
                  <span className="text-xl">🏆</span>
                </div>
                <span className="text-xs font-black text-[#3390ec] mb-1">
                  Klaim #1
                </span>
                <div className="w-20 sm:w-24 h-32 sm:h-38 rounded-t-2xl bg-gradient-to-b from-[#3390ec] via-[#2481cc] to-[#1c6fb3] flex flex-col items-center justify-start pt-2.5 border-t-2 border-white/80 shadow-lg shadow-blue-400/40">
                  <span className="text-white text-3xl sm:text-4xl font-black drop-shadow-md opacity-95">
                    1
                  </span>
                </div>
              </div>
            )}

            {/* Rank 3 (Right, Soft Cyan - Lowest) */}
            {bot3 ? (
              <div
                className="flex flex-col items-center group/p3 cursor-pointer transition-transform duration-200 hover:-translate-y-1.5"
                onClick={(e) => handlePodiumClick(e, bot3)}
                title={`Klik untuk rebut #${3} ${bot3.bot_name}`}
              >
                <div className="relative mb-1.5">
                  <img
                    src={bot3.avatar_url}
                    alt={bot3.bot_name}
                    className="w-11 h-11 sm:w-13 sm:h-13 rounded-full object-cover border-2 border-white shadow-md group-hover/p3:ring-2 group-hover/p3:ring-[#7bd8d2]"
                  />
                </div>
                <span className="text-[10px] sm:text-[11px] font-bold text-[#1c242b] truncate max-w-[70px] sm:max-w-[85px] text-center mb-1">
                  {bot3.bot_name.split(' ')[0]}
                </span>
                {/* 3D Cylinder Body */}
                <div className="w-16 sm:w-20 h-18 sm:h-22 rounded-t-2xl bg-gradient-to-b from-[#cbf3f0] via-[#a6e8e4] to-[#7bd8d2] flex flex-col items-center justify-start pt-2 border-t-2 border-white/80 shadow-md shadow-teal-200/30">
                  <span className="text-white text-2xl sm:text-3xl font-black drop-shadow-xs opacity-95">
                    3
                  </span>
                </div>
              </div>
            ) : (
              <div
                className="flex flex-col items-center group/p3 cursor-pointer transition-transform duration-200 hover:-translate-y-1"
                onClick={onOpenSubmit}
                title="Klaim Posisi #3"
              >
                <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-full border-2 border-dashed border-[#7bd8d2] bg-white/70 flex items-center justify-center text-slate-400 mb-1.5 shadow-2xs group-hover/p3:border-[#3390ec] group-hover/p3:text-[#3390ec]">
                  <MgcAdd size={16} />
                </div>
                <span className="text-[10px] font-bold text-[#707579] mb-1">
                  Klaim #3
                </span>
                <div className="w-16 sm:w-20 h-18 sm:h-22 rounded-t-2xl bg-gradient-to-b from-[#e8f8f7] to-[#d2f3f0] flex flex-col items-center justify-start pt-2 border-t border-dashed border-[#7bd8d2]">
                  <span className="text-teal-600/60 text-2xl sm:text-3xl font-black">
                    3
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
