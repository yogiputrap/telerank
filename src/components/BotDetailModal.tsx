'use client';

import React from 'react';
import { MgcClose, MgcExternalLink, MgcTelegram, MgcCheckCircle } from './MingCuteIcons';
import { Bot, CATEGORY_LABELS } from '../types';

interface BotDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  bot: Bot | null;
  rank: number;
  onRebut: (bot: Bot) => void;
}

export const BotDetailModal: React.FC<BotDetailModalProps> = ({
  isOpen,
  onClose,
  bot,
  rank,
  onRebut,
}) => {
  if (!isOpen || !bot) return null;

  const categoryName = CATEGORY_LABELS[bot.category] || bot.category;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white border border-[#e4ecf2] p-5 sm:p-7 shadow-2xl space-y-4">
        {/* Header: Verified checkmark is placed INLINE right after the bot name */}
        <div className="flex items-start justify-between gap-3 pb-3.5 border-b border-[#e4ecf2]">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <div className="relative shrink-0">
              <img
                src={bot.avatar_url}
                alt={bot.bot_name}
                className="w-12 h-12 rounded-2xl object-cover border border-[#e4ecf2]"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#4cd964] border-2 border-white" />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-sm sm:text-base font-black text-[#1c242b] leading-snug">
                <span>{bot.bot_name}</span>
                {bot.is_verified && (
                  <span
                    className="inline-flex items-center align-middle ml-1.5 text-[#3390ec] shrink-0"
                    title="Bot Terverifikasi"
                  >
                    <MgcCheckCircle size={16} />
                  </span>
                )}
              </h3>
              <p className="text-xs font-mono text-[#3390ec] font-bold pt-0.5">
                @{bot.telegram_username}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#707579] hover:text-[#1c242b] hover:bg-[#f4f7fa] transition-all cursor-pointer shrink-0 ml-1"
          >
            <MgcClose size={18} />
          </button>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2.5 rounded-xl bg-[#f4f7fa] border border-[#e4ecf2]">
            <span className="block text-[10px] text-[#707579] uppercase font-bold">Peringkat</span>
            <span className="font-mono text-lg font-black text-[#3390ec]">#{rank}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#f4f7fa] border border-[#e4ecf2]">
            <span className="block text-[10px] text-[#707579] uppercase font-bold">Total Sponsor</span>
            <span className="font-mono text-sm sm:text-base font-black text-[#1c242b]">
              Rp{bot.total_bid_amount.toLocaleString('id-ID')}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#f4f7fa] border border-[#e4ecf2]">
            <span className="block text-[10px] text-[#707579] uppercase font-bold">Total Klik</span>
            <span className="font-mono text-lg font-black text-[#1c242b]">{bot.daily_clicks}</span>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <h5 className="text-xs font-bold text-[#1c242b] uppercase tracking-wider">Deskripsi Bot</h5>
            <span className="px-2 py-0.5 rounded-md bg-[#eef5fc] text-[#3390ec] text-[10px] font-bold">
              {categoryName}
            </span>
          </div>
          <p className="text-xs text-[#707579] leading-relaxed bg-[#f4f7fa] p-3 rounded-xl border border-[#e4ecf2]">
            {bot.description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
          <a
            href={`https://t.me/${bot.telegram_username}?start=telerank`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-[#3390ec] hover:bg-[#2481cc] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
          >
            <MgcTelegram size={16} />
            <span>Buka Bot di Telegram</span>
            <MgcExternalLink size={14} />
          </a>

          <button
            type="button"
            onClick={() => {
              onClose();
              onRebut(bot);
            }}
            className="w-full sm:w-auto py-2.5 px-5 rounded-xl bg-[#f4f7fa] hover:bg-[#eef5fc] border border-[#d2e5f8] text-[#3390ec] font-bold text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors"
          >
            <span>Rebut Posisi #{rank}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
