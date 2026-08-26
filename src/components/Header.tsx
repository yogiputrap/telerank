'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { MgcTelegram, MgcShield, MgcExternalLink, MgcAdd } from './MingCuteIcons';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    if (isScrolled) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-3 z-50 w-full px-4 flex justify-center pointer-events-none mb-2">
      <motion.div
        layout
        onClick={scrollToTop}
        title={isScrolled ? 'Klik untuk kembali ke atas' : undefined}
        transition={{
          type: 'spring',
          stiffness: 450,
          damping: 38,
          mass: 0.7,
        }}
        className={`pointer-events-auto relative overflow-hidden flex items-center justify-between rounded-full bg-white/35 hover:bg-white/45 backdrop-blur-xl border border-white/60 shadow-md shadow-slate-900/5 transition-colors duration-300 ${
          isScrolled
            ? 'h-11 px-3.5 sm:px-4 shadow-xl shadow-[#3390ec]/20 hover:scale-105 active:scale-95 cursor-pointer ring-1 ring-[#3390ec]/30 bg-white/45'
            : 'w-full max-w-3xl h-13 px-4 sm:px-6 ring-1 ring-white/40'
        }`}
        style={{
          backdropFilter: 'blur(20px) saturate(200%)',
          WebkitBackdropFilter: 'blur(20px) saturate(200%)',
        }}
      >
        {/* Crystal Clear Liquid Glass Specular Reflections */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/60 via-white/10 to-transparent pointer-events-none opacity-80" />
        <div className="absolute -inset-px rounded-full bg-gradient-to-r from-[#3390ec]/10 via-transparent to-[#3390ec]/10 pointer-events-none" />
        <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />

        {/* Brand Group: Logo + TeleRank + Showcase Pill */}
        <motion.div layout className="relative flex items-center gap-2.5 z-10 shrink-0">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-full bg-[#3390ec] flex items-center justify-center text-white shadow-xs shrink-0 group-hover:scale-105 transition-transform">
              <MgcTelegram size={17} />
            </div>
            <div className="flex items-center">
              <span className="text-base font-black tracking-tight text-[#1c242b] whitespace-nowrap">
                Tele<span className="text-[#3390ec]">Rank</span>
              </span>
              <span className="text-[10px] text-[#3390ec] font-bold ml-2 px-2 py-0.5 rounded-full bg-[#3390ec]/10 border border-[#3390ec]/20 whitespace-nowrap">
                Showcase
              </span>
            </div>
          </Link>
        </motion.div>

        {/* Right Group: Navigation Links & Action */}
        <AnimatePresence mode="popLayout">
          {!isScrolled && (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.85, x: 20 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="relative flex items-center gap-2.5 sm:gap-3.5 text-xs font-semibold text-[#1c242b]/80 z-10 shrink-0"
            >
              <Link href="/aturan" className="hover:text-[#3390ec] transition-colors hidden sm:inline-block">
                Aturan
              </Link>
              <Link href="/statistik" className="hover:text-[#3390ec] transition-colors hidden sm:inline-block">
                Statistik
              </Link>
              <Link href="/tentang" className="hover:text-[#3390ec] transition-colors hidden sm:inline-block">
                Tentang
              </Link>

              <Link
                href="/new"
                className="px-3 py-1.5 rounded-full bg-[#3390ec] hover:bg-[#2481cc] text-white font-bold text-xs flex items-center gap-1 shadow-xs active:scale-95 transition-all"
              >
                <MgcAdd size={14} />
                <span>Listing Bot</span>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </header>
  );
};
