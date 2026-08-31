'use client';

import React from 'react';
import Link from 'next/link';
import { MgcTelegram, MgcExternalLink } from './MingCuteIcons';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full max-w-3xl mx-auto py-12 px-4 text-center text-xs text-[#707579] space-y-4 mt-12 border-t border-[#e4ecf2]">
      {/* Brand & Mission */}
      <div className="flex items-center justify-center gap-2">
        <div className="w-6 h-6 rounded-lg bg-[#3390ec] text-white flex items-center justify-center shadow-xs">
          <MgcTelegram size={14} />
        </div>
        <span className="text-[#1c242b] font-black text-sm">
          TeleRank.id • Papan Peringkat Bot Telegram Indonesia
        </span>
      </div>

      <p className="text-xs text-[#707579] max-w-lg mx-auto leading-relaxed">
        Direktori dan leaderboard terbuka untuk menemukan, mempromosikan, dan menaikkan eksposur bot Telegram terbaik di Indonesia secara transparan.
      </p>

      {/* Footer Navigation Links */}
      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-semibold text-[#1c242b]">
        <Link href="/" className="hover:text-[#3390ec] transition-colors">
          Leaderboard
        </Link>
        <span>•</span>
        <Link href="/new" className="hover:text-[#3390ec] transition-colors text-[#3390ec] font-bold">
          + Pasang Bot Baru
        </Link>
        <span>•</span>
        <Link href="/aturan" className="hover:text-[#3390ec] transition-colors">
          Aturan Main
        </Link>
        <span>•</span>
        <Link href="/statistik" className="hover:text-[#3390ec] transition-colors">
          Statistik
        </Link>
        <span>•</span>
        <Link href="/tentang" className="hover:text-[#3390ec] transition-colors">
          Tentang Kami
        </Link>
        <span>•</span>
        <Link href="/terms" className="hover:text-[#3390ec] transition-colors">
          Syarat & Ketentuan
        </Link>
        <span>•</span>
        <Link href="/privacy" className="hover:text-[#3390ec] transition-colors">
          Kebijakan Privasi
        </Link>
      </div>

      {/* Meta & Copyright */}
      <div className="pt-2 text-[11px] text-[#707579] border-t border-[#e4ecf2]/60 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>© {new Date().getFullYear()} TeleRank.id. All rights reserved.</span>
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
