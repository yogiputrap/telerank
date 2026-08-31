'use client';

import React, { useState, useEffect } from 'react';
import { MgcClose, MgcTelegram, MgcAdd, MgcSubtract, MgcArrowRight, MgcLoading, MgcCheckCircle, MgcWarning } from './MingCuteIcons';
import { usernameError } from '../lib/orderErrors';
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
    avatarUrl?: string;
  }) => Promise<string | void>;
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
  const defaultRecAmount = currentBots[0]?.total_bid_amount ? currentBots[0].total_bid_amount + 1000 : 1000;
  const [amount, setAmount] = useState<number>(initialAmount || defaultRecAmount);
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [isFetchingTg, setIsFetchingTg] = useState(false);
  const [tgFetched, setTgfetcHed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const rec = currentBots[0]?.total_bid_amount ? currentBots[0].total_bid_amount + 1000 : 1000;
      setUsername(initialUsername || '');
      setCategory(initialCategory || 'DOWNLOADER');
      setAmount(initialAmount || rec);
      setError('');
      setAvatarUrl('');
      setTgfetcHed(false);
      setTouched(false);
    }
  }, [isOpen, initialUsername, initialCategory, initialAmount, currentBots]);

  // Auto-fetch Telegram bot info & avatar when username is typed
  useEffect(() => {
    const clean = username.replace(/^https?:\/\/t\.me\//i, '').replace(/^@/, '').trim();
    if (!clean || clean.length < 5 || !/^[a-zA-Z0-9_]{5,32}$/.test(clean) || !/bot$/i.test(clean)) {
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
          setBotName(data.botName);
        } else {
          setBotName(clean);
        }
        if (data.description !== undefined) {
          setDescription(data.description);
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
    setAmount((prev) => Math.max(1000, prev - val));
  };

  const handleManualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    const val = raw === '' ? 0 : parseInt(raw, 10);
    setAmount(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);

    const cleanUsername = username.replace(/^https?:\/\/t\.me\//i, '').replace(/^@/, '').trim();
    const cleanBotName = botName.trim();

    if (!cleanUsername) {
      setError('Mohon masukkan username bot Telegram kamu.');
      return;
    }
    const localError = usernameError(cleanUsername);
    if (localError) {
      setError(localError);
      return;
    }
    if (!cleanBotName) {
      setError('Mohon masukkan nama judul bot Telegram kamu.');
      return;
    }
    if (amount < 1000) {
      setError('Nominal sponsor minimal Rp1.000.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      const failure = await onProceedPayment({
        username: cleanUsername,
        botName: cleanBotName,
        category,
        description: description.trim(),
        amount,
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
                Promosikan Bot Telegram
              </h3>
              <p className="text-[11px] text-[#707579]">
                Lengkapi identitas bot kamu sebelum lanjut ke pembayaran
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
        <form onSubmit={handleSubmit} noValidate className="space-y-3.5 text-xs">
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
                placeholder="NamaBot_bot (wajib akhiran 'bot')"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value.replace(/^https?:\/\/t\.me\//i, '').replace(/^@/, ''));
                  setError('');
                }}
                className={`w-full pl-8 pr-10 py-2.5 rounded-xl text-xs text-[#1c242b] bg-[#f4f7fa] border transition-colors focus:outline-none focus:bg-white ${
                  touched && (!username.trim() || Boolean(usernameError(username)))
                    ? 'border-rose-300 focus:border-rose-500'
                    : 'border-[#e4ecf2] focus:border-[#3390ec]'
                }`}
              />
              {isFetchingTg && (
                <span className="absolute right-3 text-[#3390ec]">
                  <MgcLoading size={15} />
                </span>
              )}
            </div>

            {touched && !username.trim() ? (
              <p className="text-[11px] text-rose-600 font-semibold flex items-center gap-1 pt-0.5">
                <MgcWarning size={12} className="shrink-0" />
                <span>Username bot Telegram wajib diisi.</span>
              </p>
            ) : username.trim().length >= 3 && !/bot$/i.test(username.trim()) ? (
              <p className="text-[11px] text-amber-600 font-semibold flex items-center gap-1 pt-0.5">
                <MgcWarning size={12} className="shrink-0" />
                <span>Username harus berakhiran kata <strong>"bot"</strong> (contoh: @NamaBot).</span>
              </p>
            ) : (
              <p className="text-[10px] text-[#707579]">Gunakan akhiran 'bot' (contoh: @NamaBot)</p>
            )}

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
                      {isFetchingTg ? `@${username.replace(/^@/, '')}` : (botName || `@${username.replace(/^@/, '')}`)}
                    </span>
                    {tgFetched && !isFetchingTg && (
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
              onChange={(e) => {
                setBotName(e.target.value);
                setError('');
              }}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs text-[#1c242b] bg-[#f4f7fa] border transition-colors focus:outline-none focus:bg-white ${
                touched && !botName.trim()
                  ? 'border-rose-300 focus:border-rose-500'
                  : 'border-[#e4ecf2] focus:border-[#3390ec]'
              }`}
            />
            {touched && !botName.trim() ? (
              <p className="text-[11px] text-rose-600 font-semibold flex items-center gap-1 pt-0.5">
                <MgcWarning size={12} className="shrink-0" />
                <span>Nama judul bot wajib diisi.</span>
              </p>
            ) : (
              <p className="text-[10px] text-[#707579]">Judul yang tampil di direktori (contoh: TikGrab — TikTok Downloader)</p>
            )}
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
              <span className="text-[11px] text-[#707579]">Ketik manual bebas (Min Rp1.000)</span>
            </div>

            <div className={`flex items-center justify-between gap-2 p-2 bg-[#f4f7fa] rounded-2xl border transition-all ${
              amount < 1000 ? 'border-rose-300 bg-rose-50/40' : 'border-[#e4ecf2] focus-within:border-[#3390ec] focus-within:bg-white'
            }`}>
              <button
                type="button"
                onClick={() => handleDecrease(1000)}
                className="w-8 h-8 rounded-xl bg-white hover:bg-[#eef5fc] text-[#3390ec] flex items-center justify-center font-bold shadow-2xs cursor-pointer active:scale-95 border border-[#d2e5f8] shrink-0"
                title="-1k Rupiah"
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
                    placeholder="1.000"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleAdd(1000)}
                className="w-8 h-8 rounded-xl bg-white hover:bg-[#eef5fc] text-[#3390ec] flex items-center justify-center font-bold shadow-2xs cursor-pointer active:scale-95 border border-[#d2e5f8] shrink-0"
                title="+1k Rupiah"
              >
                <MgcAdd size={14} />
              </button>
            </div>

            {/* Dynamic Status / Validation Helper Box */}
            {amount < 1000 ? (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2 animate-in fade-in duration-150">
                <MgcWarning size={15} className="shrink-0 mt-0.5 text-rose-600" />
                <span>Nominal listing minimal <strong>Rp1.000</strong>.</span>
              </div>
            ) : (
              <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center justify-between gap-1.5 animate-in fade-in duration-150">
                <div className="flex items-center gap-1.5">
                  <MgcCheckCircle size={15} className="shrink-0 text-emerald-600" />
                  <span>Mendapatkan <strong>Peringkat #{projectedRank}</strong></span>
                </div>
              </div>
            )}

            {/* Quick Preset Chips */}
            <div className="space-y-1 pt-1">
              <span className="text-[11px] font-semibold text-[#707579]">Tambah Cepat:</span>
              <div className="grid grid-cols-5 gap-1.5 text-center">
                {[1000, 5000, 10000, 25000, 50000].map((step) => (
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
            {error && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-start gap-2 animate-in fade-in duration-150">
                <MgcWarning size={15} className="shrink-0 mt-0.5 text-rose-600" />
                <span>{error}</span>
              </div>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
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
