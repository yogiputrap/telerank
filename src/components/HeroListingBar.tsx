'use client';

import React, { useState, useEffect } from 'react';
import { MgcAdd, MgcSubtract, MgcArrowRight, MgcTelegram, MgcWarning } from './MingCuteIcons';
import { usernameError } from '../lib/orderErrors';
import { Bot, BotCategory, BOT_CATEGORIES } from '../types';

interface HeroListingBarProps {
  currentBots: Bot[];
  onSubmit: (botUsername: string, category: BotCategory, amount: number) => void;
}

export const HeroListingBar: React.FC<HeroListingBarProps> = ({
  currentBots,
  onSubmit,
}) => {
  const topBotAmount = currentBots[0]?.total_bid_amount;
  const defaultRecommendedBid = topBotAmount ? topBotAmount + 1000 : 1000;
  const [amount, setAmount] = useState<number>(defaultRecommendedBid);
  const [hasManuallyEdited, setHasManuallyEdited] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [category, setCategory] = useState<BotCategory>('DOWNLOADER');
  const [inlineError, setInlineError] = useState('');

  // Dynamically sync recommended amount when currentBots loads/changes if not manually edited
  useEffect(() => {
    if (!hasManuallyEdited) {
      const topBid = currentBots[0]?.total_bid_amount;
      setAmount(topBid ? topBid + 1000 : 1000);
    }
  }, [currentBots, hasManuallyEdited]);

  // Dynamic Calculation of Projected Rank based on current amount vs all bots
  const projectedRank = (() => {
    if (currentBots.length === 0) return 1;
    let rank = currentBots.length + 1;
    for (let i = 0; i < currentBots.length; i++) {
      if (amount > currentBots[i].total_bid_amount) {
        rank = i + 1;
        break;
      }
    }
    return rank;
  })();

  const handleDecrease = () => {
    setHasManuallyEdited(true);
    if (amount > 100000) {
      setAmount((prev) => Math.max(1000, prev - 10000));
    } else if (amount > 10000) {
      setAmount((prev) => Math.max(1000, prev - 5000));
    } else if (amount > 1000) {
      setAmount((prev) => Math.max(1000, prev - 1000));
    } else {
      setAmount(1000);
    }
  };

  const handleIncrease = () => {
    setHasManuallyEdited(true);
    if (amount >= 100000) {
      setAmount((prev) => prev + 10000);
    } else if (amount >= 10000) {
      setAmount((prev) => prev + 5000);
    } else {
      setAmount((prev) => prev + 1000);
    }
  };

  const handleManualAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasManuallyEdited(true);
    const raw = e.target.value.replace(/\D/g, '');
    const val = raw === '' ? 0 : parseInt(raw, 10);
    setAmount(val);
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/^https?:\/\/t\.me\//i, '').replace(/^@/, '').trim();
    setUsernameInput(raw);
    if (raw.length >= 3 && !/bot$/i.test(raw)) {
      setInlineError('Username bot harus berakhiran "bot" (contoh: @NamaBot atau @my_bot)');
    } else {
      setInlineError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUsername = usernameInput.replace(/^https?:\/\/t\.me\//i, '').replace(/^@/, '').trim();
    if (!cleanUsername) {
      setInlineError('Masukkan username bot Telegram.');
      return;
    }
    const err = usernameError(cleanUsername);
    if (err) {
      setInlineError(err);
      return;
    }
    if (amount < 1000) {
      setInlineError('Nominal sponsor minimal Rp1.000.');
      return;
    }
    setInlineError('');
    onSubmit(cleanUsername, category, amount);
  };

  return (
    <div className="w-full max-w-3xl mx-auto text-center py-4 px-2 sm:px-4 space-y-3">
      {/* Small Subtitle */}
      <div className="space-y-1">
        <span className="text-[11px] font-bold tracking-widest text-[#707579] uppercase">
          LISTING BOT TELEGRAM
        </span>

        {/* Big Stepper Headline - Fully Responsive for Mobile and Desktop */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5 text-lg sm:text-2xl md:text-3xl font-black text-[#1c242b] py-1">
          <div className="flex items-center gap-1.5 shrink-0">
            <span>Ambil posisi</span>
            <span className="px-2.5 py-0.5 rounded-xl bg-[#3390ec] text-white font-mono font-black shadow-xs shrink-0 text-sm sm:text-2xl">
              #{projectedRank}
            </span>
            <span>dengan</span>
          </div>

          {/* Stepper with Minus - Editable Input - Plus */}
          <div className="inline-flex items-center gap-1 sm:gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleDecrease}
              aria-label="Kurangi nominal sponsor"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white hover:bg-[#eef5fc] text-[#3390ec] flex items-center justify-center transition-colors shadow-2xs cursor-pointer active:scale-95 border border-[#d2e5f8] shrink-0 font-bold"
              title="Kurangi nominal"
            >
              <MgcSubtract size={14} />
            </button>

            {/* Direct Editable Custom Price Input */}
            <div className="flex items-center border-b-2 border-[#3390ec] bg-[#eef5fc] hover:bg-[#e4f0fa] focus-within:bg-[#e4f0fa] px-2 sm:px-2.5 py-0.5 rounded-t-lg transition-colors shrink-0">
              <span className="font-mono text-base sm:text-2xl md:text-3xl text-[#3390ec] font-bold mr-0.5 select-none">
                Rp
              </span>
              <input
                type="text"
                inputMode="numeric"
                aria-label="Nominal sponsor dalam rupiah"
                value={amount === 0 ? '' : amount.toLocaleString('id-ID')}
                onChange={handleManualAmountChange}
                placeholder="1.000"
                className="font-mono text-base sm:text-2xl md:text-3xl text-[#1c242b] font-black bg-transparent outline-none w-24 sm:w-36 md:w-44 text-left"
                title="Ketik nominal manual bebas di sini"
              />
            </div>

            <button
              type="button"
              onClick={handleIncrease}
              aria-label="Tambah nominal sponsor"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white hover:bg-[#eef5fc] text-[#3390ec] flex items-center justify-center transition-colors shadow-2xs cursor-pointer active:scale-95 border border-[#d2e5f8] shrink-0 font-bold"
              title="Tambah nominal"
            >
              <MgcAdd size={14} />
            </button>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-[#707579] pt-0.5">
          Listing bot mulai <strong className="text-[#1c242b]">Rp1.000</strong>. Nominal menentukan posisi peringkat secara otomatis.
        </p>
      </div>

      {/* 1-Row Compact Form (100% Identical Category Names) */}
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-white p-2 rounded-2xl border border-[#e4ecf2] shadow-xs"
      >
        <div className="relative flex-1 flex items-center">
          <span className="absolute left-3.5 text-[#3390ec] font-mono text-sm font-bold select-none">
            @
          </span>
          <input
            id="fast-submit-input"
            type="text"
            required
            aria-label="Username bot Telegram"
            placeholder="UsernameBot_bot (wajib akhiran 'bot')..."
            value={usernameInput}
            onChange={handleUsernameChange}
            className="w-full pl-8 pr-4 py-2.5 rounded-xl text-xs sm:text-sm text-[#1c242b] placeholder:text-[#707579] bg-[#f4f7fa] border border-[#e4ecf2] focus:outline-none focus:bg-white focus:border-[#3390ec]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={category}
            aria-label="Pilih kategori bot"
            onChange={(e) => setCategory(e.target.value as BotCategory)}
            className="px-3 py-2.5 rounded-xl text-xs text-[#1c242b] bg-[#f4f7fa] border border-[#e4ecf2] focus:outline-none focus:bg-white focus:border-[#3390ec]"
          >
            {BOT_CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[#3390ec] hover:bg-[#2481cc] active:scale-95 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer shrink-0"
          >
            <span>Promosikan</span>
            <MgcArrowRight size={16} />
          </button>
        </div>
      </form>

      {inlineError ? (
        <p className="text-xs text-rose-600 font-semibold flex items-center justify-center gap-1 animate-in fade-in duration-150">
          <MgcWarning size={13} className="shrink-0" />
          <span>{inlineError}</span>
        </p>
      ) : (
        <p className="text-[11px] text-[#707579]">
          Sudah ada di ranking? Masukkan username yang sama untuk menambah bid.
        </p>
      )}
    </div>
  );
};
