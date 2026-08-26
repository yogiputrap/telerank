'use client';

import React, { useState } from 'react';
import { MgcClose, MgcFlash, MgcArrowRight } from './MingCuteIcons';
import { Bot } from '../types';

interface TopUpBidModalProps {
  isOpen: boolean;
  onClose: () => void;
  bot: Bot | null;
  currentBots: Bot[];
  onProceedToPayment: (bot: Bot, addAmount: number) => void;
}

const TOPUP_OPTIONS = [10000, 25000, 50000, 100000, 250000];

export const TopUpBidModal: React.FC<TopUpBidModalProps> = ({
  isOpen,
  onClose,
  bot,
  currentBots,
  onProceedToPayment,
}) => {
  const [addAmount, setAddAmount] = useState<number>(25000);

  if (!isOpen || !bot) return null;

  const currentRank = currentBots.findIndex((b) => b.id === bot.id) + 1;
  const newTotalBid = bot.total_bid_amount + addAmount;

  const handleTopUp = (e: React.FormEvent) => {
    e.preventDefault();
    onProceedToPayment(bot, addAmount);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white border border-slate-200 p-6 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 font-bold text-xs">
              <MgcFlash size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Salip Posisi Ranking</h3>
              <p className="text-[11px] text-slate-400">Tambah nominal sponsor untuk naik ke peringkat atas</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
          >
            <MgcClose size={18} />
          </button>
        </div>

        {/* Bot Info */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
          <img src={bot.avatar_url} alt={bot.bot_name} className="w-10 h-10 rounded-xl object-cover" />
          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-xs text-slate-900 truncate">{bot.bot_name}</h4>
            <p className="text-[11px] font-mono text-slate-500">@{bot.telegram_username} • Posisi #{currentRank}</p>
          </div>
        </div>

        <form onSubmit={handleTopUp} className="space-y-4 text-xs">
          {/* Preset Buttons */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">Pilih Tambahan Sponsor</label>
            <div className="grid grid-cols-3 gap-2">
              {TOPUP_OPTIONS.map((amt) => (
                <button
                  type="button"
                  key={amt}
                  onClick={() => setAddAmount(amt)}
                  className={`py-2 rounded-xl font-bold border transition-all cursor-pointer ${
                    addAmount === amt
                      ? 'bg-amber-400 border-amber-400 text-slate-950 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  +Rp {amt.toLocaleString('id-ID')}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 flex justify-between items-center text-xs">
            <span className="text-slate-600 font-medium">Total Akumulasi Baru:</span>
            <span className="font-mono font-bold text-amber-900 text-sm">
              Rp {newTotalBid.toLocaleString('id-ID')}
            </span>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-full bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-98 transition-all cursor-pointer"
          >
            <span>Bayar via QRIS Instan</span>
            <MgcArrowRight size={14} />
          </button>
        </form>
      </div>
    </div>
  );
};
