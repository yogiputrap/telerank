'use client';

import React from 'react';
import Link from 'next/link';
import { MgcTelegram, MgcExternalLink } from './MingCuteIcons';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full max-w-3xl mx-auto pt-10 pb-20 sm:pb-10 px-4 text-center text-xs text-[#707579] space-y-4 mt-12 border-t border-[#e4ecf2]">
      {/* Brand & Mission */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#3390ec] text-white flex items-center justify-center shadow-xs shrink-0">
            <MgcTelegram size={14} />
          </div>
          <span className="text-[#1c242b] font-black text-sm sm:text-base">
            TeleRank
          </span>
        </div>
        <span className="text-[#707579] font-medium text-xs sm:text-sm">
          Papan Peringkat Bot Telegram Indonesia
        </span>
      </div>

      <p className="text-xs text-[#707579] max-w-lg mx-auto leading-relaxed px-2">
        Direktori dan leaderboard terbuka untuk menemukan, mempromosikan, dan menaikkan eksposur bot Telegram terbaik di Indonesia secara transparan.
      </p>

      {/* Footer Navigation Links - Responsive without awkward isolated dots */}
      <div className="flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-6 gap-y-2 text-xs font-semibold text-[#1c242b] pt-1">
        <Link href="/" className="hover:text-[#3390ec] transition-colors py-0.5">
          Leaderboard
        </Link>
        <Link href="/new" className="hover:text-[#3390ec] transition-colors text-[#3390ec] font-bold py-0.5">
          + Pasang Bot Baru
        </Link>
        <Link href="/aturan" className="hover:text-[#3390ec] transition-colors py-0.5">
          Aturan Main
        </Link>
        <Link href="/statistik" className="hover:text-[#3390ec] transition-colors py-0.5">
          Statistik
        </Link>
        <Link href="/tentang" className="hover:text-[#3390ec] transition-colors py-0.5">
          Tentang Kami
        </Link>
        <Link href="/terms" className="hover:text-[#3390ec] transition-colors py-0.5">
          Syarat & Ketentuan
        </Link>
        <Link href="/privacy" className="hover:text-[#3390ec] transition-colors py-0.5">
          Kebijakan Privasi
        </Link>
      </div>

      {/* Meta & Copyright */}
      <div className="pt-2 text-[11px] text-[#707579] border-t border-[#e4ecf2]/60 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>© {new Date().getFullYear()} TeleRank. All rights reserved.</span>
        <a
          href="https://t.me"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#3390ec] hover:underline flex items-center gap-1 font-bold"
        >
          <span>Official Telegram Channel</span>
          <MgcExternalLink size={11} />
        </a>
      </div>
    </footer>
  );
};
