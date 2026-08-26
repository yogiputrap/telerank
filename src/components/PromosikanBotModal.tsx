'use client';

import React, { useState, useEffect } from 'react';
import { MgcClose, MgcTelegram, MgcAdd, MgcSubtract, MgcArrowRight } from './MingCuteIcons';
import { Bot, BotCategory, BOT_CATEGORIES } from '../types';

interface PromosikanBotModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialUsername: string;
  initialCategory: BotCategory;
  initialAmount: number;
  currentBots: Bot[];
  onProceedPayment: (data: {
    username: string;
    botName: string;
    category: BotCategory;
    description: string;
    amount: number;
  }) => void;
}

export const PromosikanBotModal: React.FC<PromosikanBotModalProps> = ({
  isOpen,
  onClose,
  initialUsername,
  initialCategory,
  initialAmount,
  currentBots,
  onProceedPayment,
}) => {
  const [username, setUsername] = useState(initialUsername || '');
  const [botName, setBotName] = useState('');
  const [category, setCategory] = useState<BotCategory>(initialCategory || 'DOWNLOADER');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number>(initialAmount || 50000);

  useEffect(() => {
    if (isOpen) {
      setUsername(initialUsername || '');
      setCategory(initialCategory || 'DOWNLOADER');
      setAmount(initialAmount || 50000);
    }
  }, [isOpen, initialUsername, initialCategory, initialAmount]);

  if (!isOpen) return null;

  // Dynamic projected rank calculation
  const projectedRank = (() => {
    let rank = currentBots.length + 1;
    for (let i = 0; i < currentBots.length; i++) {
      if (amount > currentBots[i].total_bid_amount) {
        rank = i + 1;
        break;
      }
    }
    return rank;
  })();

  const handleAdd = (val: number) => {
    setAmount((prev) => prev + val);
  };

  const handleDecrease = (val: number) => {
    setAmount((prev) => Math.max(10000, prev - val));
  };

  const handleManualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    const val = raw === '' ? 0 : parseInt(raw, 10);
    setAmount(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUsername = username.replace('https://t.me/', '').replace('@', '').trim();
    const cleanBotName = botName.trim();
    if (!cleanUsername || !cleanBotName || amount < 10000) return;

    onProceedPayment({
      username: cleanUsername,
      botName: cleanBotName,
      category,
      description: description.trim(),
      amount,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto no-scrollbar rounded-3xl bg-white border border-[#e4ecf2] p-5 sm:p-7 shadow-2xl space-y-4">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#e4ecf2]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#eef5fc] text-[#3390ec] flex items-center justify-center font-bold text-xs shrink-0">
              <MgcTelegram size={18} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-[#1c242b]">
                Promosikan Bot Telegram
              </h3>
              <p className="text-[11px] text-[#707579]">
                Lengkapi identitas bot kamu sebelum lanjut ke pembayaran
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#707579] hover:text-[#1c242b] hover:bg-[#f4f7fa] transition-all cursor-pointer shrink-0"
          >
            <MgcClose size={18} />
          </button>
        </div>

        {/* Projected Rank Banner */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-[#eef5fc] border border-[#d2e5f8]">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-[#707579] uppercase">Estimasi Posisi yang Didapat:</span>
            <div className="font-bold text-xs text-[#1c242b]">
              Bot kamu akan menempati peringkat di leaderboard
            </div>
          </div>
          <span className="px-3 py-1 rounded-xl bg-[#3390ec] text-white font-mono font-black text-sm shadow-xs">
            #{projectedRank}
          </span>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {/* Input 1: Username Bot Telegram (Mandatory) */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#1c242b]">
              Username Bot Telegram <span className="text-rose-500">*</span>
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-[#3390ec] font-mono text-sm font-bold">@</span>
              <input
                type="text"
                required
                placeholder="UsernameBot_bot"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-8 pr-3.5 py-2.5 rounded-xl text-xs text-[#1c242b] bg-[#f4f7fa] border border-[#e4ecf2] focus:outline-none focus:bg-white focus:border-[#3390ec]"
              />
            </div>
          </div>

          {/* Input 2: Nama Judul Bot (MANDATORY) */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#1c242b]">
              Nama Judul Bot <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: TikGrab — TikTok Downloader HD"
              value={botName}
              onChange={(e) => setBotName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs text-[#1c242b] bg-[#f4f7fa] border border-[#e4ecf2] focus:outline-none focus:bg-white focus:border-[#3390ec]"
            />
          </div>

          {/* Input 3: Kategori Bot (Mandatory) */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#1c242b]">
              Kategori Bot <span className="text-rose-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as BotCategory)}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs text-[#1c242b] bg-[#f4f7fa] border border-[#e4ecf2] focus:outline-none focus:bg-white focus:border-[#3390ec]"
            >
              {BOT_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Input 4: Deskripsi Singkat (Maks 150 Karakter) */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-bold text-[#1c242b]">
                Deskripsi Singkat <span className="text-[#707579] font-normal text-[11px]">(Opsional)</span>
              </label>
              <span className={`text-[10px] font-mono font-semibold ${description.length >= 140 ? 'text-amber-600 font-bold' : 'text-[#707579]'}`}>
                {description.length}/150 karakter
              </span>
            </div>
            <textarea
              rows={2}
              maxLength={150}
              placeholder="Jelaskan fitur utama bot kamu (maksimal 150 karakter)..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl text-xs text-[#1c242b] bg-[#f4f7fa] border border-[#e4ecf2] focus:outline-none focus:bg-white focus:border-[#3390ec] resize-none"
            />
          </div>

          {/* Input 5: Stepper Nominal Sponsor */}
          <div className="space-y-2 pt-2 border-t border-[#e4ecf2]">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-bold text-[#1c242b]">
                Nominal Sponsor / Bid
              </label>
              <span className="text-[11px] text-[#707579]">Ketik manual bebas (Min Rp10.000)</span>
            </div>

            <div className="flex items-center justify-between gap-2 p-2 bg-[#f4f7fa] rounded-2xl border border-[#e4ecf2] focus-within:border-[#3390ec] focus-within:bg-white transition-all">
              <button
                type="button"
                onClick={() => handleDecrease(10000)}
                className="w-8 h-8 rounded-xl bg-white hover:bg-[#eef5fc] text-[#3390ec] flex items-center justify-center font-bold shadow-2xs cursor-pointer active:scale-95 border border-[#d2e5f8] shrink-0"
                title="-10k Rupiah"
              >
                <MgcSubtract size={14} />
              </button>

              <div className="text-center flex-1 min-w-0 px-2">
                <div className="flex items-center justify-center">
                  <span className="font-mono text-lg sm:text-2xl text-[#3390ec] font-black mr-1 select-none">
                    Rp
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={amount === 0 ? '' : amount.toLocaleString('id-ID')}
                    onChange={handleManualChange}
                    className="font-mono text-lg sm:text-2xl text-[#1c242b] font-black bg-transparent outline-none text-center w-full max-w-[180px]"
                    placeholder="50.000"
                  />
                </div>
                <span className="block text-[10px] text-[#3390ec] font-semibold pt-0.5">
                  {amount >= 10000 ? (
                    `Mendapatkan Peringkat #${projectedRank}`
                  ) : (
                    <span className="text-rose-600 font-bold">
                      ⚠️ Minimal listing Rp10.000
                    </span>
                  )}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleAdd(10000)}
                className="w-8 h-8 rounded-xl bg-white hover:bg-[#eef5fc] text-[#3390ec] flex items-center justify-center font-bold shadow-2xs cursor-pointer active:scale-95 border border-[#d2e5f8] shrink-0"
                title="+10k Rupiah"
              >
                <MgcAdd size={14} />
              </button>
            </div>

            {/* Quick Preset Chips */}
            <div className="space-y-1 pt-1">
              <span className="text-[11px] font-semibold text-[#707579]">Tambah Cepat:</span>
              <div className="grid grid-cols-5 gap-1.5 text-center">
                {[1000, 5000, 10000, 50000, 100000].map((step) => (
                  <button
                    type="button"
                    key={step}
                    onClick={() => handleAdd(step)}
                    className="py-1.5 px-1 rounded-lg bg-[#f4f7fa] hover:bg-[#eef5fc] hover:text-[#3390ec] border border-[#e4ecf2] text-[#707579] text-[10px] font-mono font-bold transition-all cursor-pointer"
                  >
                    +{step >= 1000 ? `${step / 1000}k` : step}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={!username.trim() || !botName.trim() || amount < 10000}
              className="w-full py-3 rounded-xl bg-[#3390ec] hover:bg-[#2481cc] active:scale-98 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Lanjut Bayar QRIS Instan</span>
              <span className="font-mono text-amber-200 font-black">
                Rp {amount.toLocaleString('id-ID')}
              </span>
              <MgcArrowRight size={14} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
