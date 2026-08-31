'use client';

import React, { useState, useEffect } from 'react';
import { MgcClose, MgcTelegram, MgcAdd, MgcSubtract, MgcArrowRight, MgcCheckCircle, MgcLoading } from './MingCuteIcons';
import { usernameError } from '../lib/orderErrors';
import { Bot, BotCategory, BOT_CATEGORIES } from '../types';

interface RebutPosisiModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetBot: Bot | null;
  targetRank: number;
  onProceedPayment: (data: {
    challengerUsername: string;
    challengerBotName: string;
    challengerDescription: string;
    challengerCategory: BotCategory;
    amount: number;
    targetBot: Bot;
    avatarUrl?: string;
  }) => Promise<string | void>;
}

export const RebutPosisiModal: React.FC<RebutPosisiModalProps> = ({
  isOpen,
  onClose,
  targetBot,
  targetRank,
  onProceedPayment,
}) => {
  const minRequired = targetBot ? targetBot.total_bid_amount + 1 : 10000;
  const [amount, setAmount] = useState<number>(minRequired);
  const [username, setUsername] = useState('');
  const [botName, setBotName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<BotCategory>('DOWNLOADER');
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [isFetchingTg, setIsFetchingTg] = useState(false);
  const [tgFetched, setTgfetcHed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (targetBot) {
      setAmount(targetBot.total_bid_amount + 1);
      setCategory(targetBot.category || 'DOWNLOADER');
      setError('');
      setAvatarUrl('');
      setTgfetcHed(false);
    }
  }, [targetBot]);

  // Auto-fetch Telegram bot info & avatar when username is typed
  useEffect(() => {
    const clean = username.replace(/^https?:\/\/t\.me\//i, '').replace(/^@/, '').trim();
    if (!clean || clean.length < 5 || !/^[a-zA-Z0-9_]{5,32}$/.test(clean)) {
      setTgfetcHed(false);
      return;
    }

    let isMounted = true;
    const timer = setTimeout(async () => {
      setIsFetchingTg(true);
      try {
        const res = await fetch(`/api/telegram/bot?username=${encodeURIComponent(clean)}`);
        if (!res.ok) return;
        const result = await res.json();
        if (!isMounted || !result.success || !result.data) return;

        const data = result.data;
        if (data.avatarUrl) {
          setAvatarUrl(data.avatarUrl);
        }
        if (data.botName) {
          setBotName((prev) => (!prev || prev === clean ? data.botName : prev));
        }
        if (data.description) {
          setDescription((prev) => (!prev ? data.description : prev));
        }
        setTgfetcHed(true);
      } catch (err) {
        console.error('Failed to auto-fetch Telegram info', err);
      } finally {
        if (isMounted) setIsFetchingTg(false);
      }
    }, 450);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [username]);

  if (!isOpen || !targetBot) return null;

  const handleAdd = (val: number) => {
    setAmount((prev) => prev + val);
  };

  const handleDecrease = (val: number) => {
    setAmount((prev) => Math.max(1, prev - val));
  };

  const handleManualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    const val = raw === '' ? 0 : parseInt(raw, 10);
    setAmount(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUsername = username.replace('https://t.me/', '').replace('@', '').trim();
    const cleanBotName = botName.trim();
    if (!cleanUsername || !cleanBotName || amount < minRequired) return;
    const localError = usernameError(cleanUsername);
    if (localError) {
      setError(localError);
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      const failure = await onProceedPayment({
        challengerUsername: cleanUsername,
        challengerBotName: cleanBotName,
        challengerDescription: description.trim(),
        challengerCategory: category,
        amount,
        targetBot,
        avatarUrl: avatarUrl || undefined,
      });
      if (failure) setError(failure);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto no-scrollbar rounded-2xl bg-white border border-[#e4ecf2] p-5 sm:p-7 shadow-2xl space-y-4">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#e4ecf2]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#eef5fc] text-[#3390ec] flex items-center justify-center font-bold text-xs shrink-0">
              <MgcTelegram size={18} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-[#1c242b]">
                Rebut Posisi #{targetRank}
              </h3>
              <p className="text-[11px] text-[#707579]">
                Isi identitas bot kamu & nominal untuk menggeser posisi ini
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#707579] hover:text-[#1c242b] hover:bg-[#f4f7fa] transition-all cursor-pointer shrink-0"
          >
            <MgcClose size={18} />
          </button>
        </div>

        {/* Target Bot Being Challenged Banner with Inline Verified Checkmark */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#f4f7fa] border border-[#e4ecf2]">
          <img
            src={targetBot.avatar_url}
            alt={targetBot.bot_name}
            className="w-10 h-10 rounded-xl object-cover border border-[#e4ecf2] shrink-0"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-1 mb-0.5">
              <span className="text-[10px] font-bold text-[#707579] uppercase">Posisi yang direbut:</span>
              <span className="text-[11px] font-mono font-bold text-[#3390ec] bg-[#eef5fc] px-1.5 py-0.5 rounded">
                #{targetRank}
              </span>
            </div>
            <h4 className="font-bold text-xs text-[#1c242b] truncate">
              <span>{targetBot.bot_name}</span>
              {targetBot.is_verified && (
                <span className="inline-flex items-center align-middle ml-1 text-[#3390ec]">
                  <MgcCheckCircle size={13} />
                </span>
              )}
            </h4>
            <p className="text-[11px] text-[#707579] font-mono">
              Sponsor saat ini: <strong className="text-[#1c242b]">Rp{targetBot.total_bid_amount.toLocaleString('id-ID')}</strong>
            </p>
          </div>
        </div>

        {/* Interactive Rebut Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {/* Input 1: Username Bot Challenger (Mandatory) */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#1c242b]">
              Username Bot Telegram Kamu <span className="text-rose-500">*</span>
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-[#3390ec] font-mono text-sm font-bold">@</span>
              <input
                type="text"
                required
                placeholder="UsernameBot_bot"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-8 pr-10 py-2.5 rounded-xl text-xs text-[#1c242b] bg-[#f4f7fa] border border-[#e4ecf2] focus:outline-none focus:bg-white focus:border-[#3390ec]"
              />
              {isFetchingTg && (
                <span className="absolute right-3 text-[#3390ec]">
                  <MgcLoading size={15} />
                </span>
              )}
            </div>

            {/* Telegram Profile Auto-Sync Preview Card */}
            {(isFetchingTg || tgFetched || avatarUrl) && username.trim().length >= 5 && (
              <div className="flex items-center gap-2.5 p-2.5 bg-[#eef5fc] border border-[#d2e5f8] rounded-xl animate-in fade-in duration-200 mt-1.5">
                <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-white border border-[#c5def5] shrink-0 flex items-center justify-center shadow-2xs">
                  <img
                    src={avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${username || 'bot'}`}
                    alt="Bot Avatar"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/bottts/svg?seed=${username || 'bot'}`;
                    }}
                  />
                  {isFetchingTg && (
                    <div className="absolute inset-0 bg-white/70 backdrop-blur-2xs flex items-center justify-center">
                      <MgcLoading size={14} className="text-[#3390ec]" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-[11px] text-[#1c242b] truncate">
                      {botName || `@${username.replace(/^@/, '')}`}
                    </span>
                    {tgFetched && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[9px] font-bold shrink-0">
                        <MgcCheckCircle size={9} />
                        Telegram Sync
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-[#707579] truncate">
                    {isFetchingTg
                      ? 'Mengambil info dari Telegram...'
                      : description || 'Foto profil & bio otomatis terdeteksi.'}
                  </p>
                </div>
              </div>
            )}
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
              placeholder="Jelaskan fitur unggulan bot kamu (maksimal 150 karakter)..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl text-xs text-[#1c242b] bg-[#f4f7fa] border border-[#e4ecf2] focus:outline-none focus:bg-white focus:border-[#3390ec] resize-none"
            />
          </div>

          {/* Input 5: Stepper Nominal Sponsor with 1-Rupiah precision */}
          <div className="space-y-2 pt-2 border-t border-[#e4ecf2]">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-bold text-[#1c242b]">
                Nominal Sponsor / Bid Baru
              </label>
              <span className="text-[11px] text-[#707579]">Ketik manual bebas</span>
            </div>

            <div className="flex items-center justify-between gap-2 p-2 bg-[#f4f7fa] rounded-2xl border border-[#e4ecf2] focus-within:border-[#3390ec] focus-within:bg-white transition-all">
              <button
                type="button"
                onClick={() => handleDecrease(1)}
                className="w-8 h-8 rounded-xl bg-white hover:bg-[#eef5fc] text-[#3390ec] flex items-center justify-center font-bold shadow-2xs cursor-pointer active:scale-95 border border-[#d2e5f8] shrink-0"
                title="-1 Rupiah"
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
                    placeholder="10.001"
                  />
                </div>
                <span className="block text-[10px] text-[#3390ec] font-semibold pt-0.5">
                  {amount >= minRequired ? (
                    `(+Rp${(amount - targetBot.total_bid_amount).toLocaleString('id-ID')} lebih tinggi)`
                  ) : (
                    <span className="text-rose-600 font-bold">
                      ⚠️ Minimal Rp{minRequired.toLocaleString('id-ID')} (+Rp1 untuk merebut)
                    </span>
                  )}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleAdd(1)}
                className="w-8 h-8 rounded-xl bg-white hover:bg-[#eef5fc] text-[#3390ec] flex items-center justify-center font-bold shadow-2xs cursor-pointer active:scale-95 border border-[#d2e5f8] shrink-0"
                title="+1 Rupiah"
              >
                <MgcAdd size={14} />
              </button>
            </div>

            {/* Quick Preset Chips */}
            <div className="space-y-1 pt-1">
              <span className="text-[11px] font-semibold text-[#707579]">Tambah Cepat:</span>
              <div className="grid grid-cols-5 gap-1.5 text-center">
                {[1, 100, 1000, 10000, 50000].map((step) => (
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
          <div className="pt-2 space-y-1.5">
            {error && <p className="text-xs text-rose-600 font-semibold">{error}</p>}
            <button
              type="submit"
              disabled={isSubmitting || !username.trim() || !botName.trim() || amount < minRequired}
              className="w-full py-3 rounded-xl bg-[#3390ec] hover:bg-[#2481cc] active:scale-98 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{isSubmitting ? 'Membuat Order...' : 'Lanjut Bayar QRIS Instan'}</span>
              {!isSubmitting && (
                <span className="font-mono text-amber-200 font-black">
                  Rp {amount.toLocaleString('id-ID')}
                </span>
              )}
              {!isSubmitting && <MgcArrowRight size={14} />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
