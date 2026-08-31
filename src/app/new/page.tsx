'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { PayKitaQRISModal } from '../../components/PayKitaQRISModal';
import { MgcArrowRight, MgcSubtract, MgcAdd, MgcLoading, MgcCheckCircle } from '../../components/MingCuteIcons';
import { orderErrorMessage, usernameError } from '../../lib/orderErrors';
import { Bot, BotCategory, BOT_CATEGORIES } from '../../types';

export default function NewListingPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [botName, setBotName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<BotCategory>('DOWNLOADER');
  const [amount, setAmount] = useState<number>(50000);
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [isFetchingTg, setIsFetchingTg] = useState(false);
  const [tgFetched, setTgfetcHed] = useState(false);
  const [currentBots, setCurrentBots] = useState<Bot[]>([]);
  const [isQRISModalOpen, setIsQRISModalOpen] = useState(false);
  const [pendingOrder, setPendingOrder] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    fetch('/api/bots?limit=100')
      .then(async (response) => {
        if (!response.ok) throw new Error('BACKEND_UNAVAILABLE');
        const result = await response.json();
        if (!cancelled && result.data) setCurrentBots(result.data);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  // Auto-fetch Telegram bot info & avatar when username is entered
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

  const projectedRank = (() => {
    const sorted = [...currentBots].sort((a, b) => b.total_bid_amount - a.total_bid_amount);
    let rank = sorted.length + 1;
    for (let i = 0; i < sorted.length; i++) {
      if (amount > sorted[i].total_bid_amount) {
        rank = i + 1;
        break;
      }
    }
    return rank;
  })();

  const handleDecrease = (val: number) => {
    setAmount((prev) => Math.max(10000, prev - val));
  };

  const handleIncrease = (val: number) => {
    setAmount((prev) => prev + val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUsername = username.replace('https://t.me/', '').replace('@', '').trim();
    const cleanBotName = botName.trim();
    if (!cleanUsername || !cleanBotName || amount < 10000) return;
    const localError = usernameError(cleanUsername);
    if (localError) {
      setError(localError);
      return;
    }
    setIsSubmitting(true);
    setError('');
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          telegramUsername: cleanUsername,
          botName: cleanBotName,
          description: description.trim(),
          category,
          amount,
          avatarUrl: avatarUrl || undefined,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'ORDER_FAILED');
      setPendingOrder({
        orderId: result.data.public_id,
        botName: cleanBotName,
        telegramUsername: cleanUsername,
        category,
        amount: result.data.amount,
        payAmount: result.data.pay_amount,
        qrisString: result.data.qris,
        expiresAt: result.data.expires_at,
        checkoutUrl: result.data.checkout_url,
        sandbox: result.data.sandbox,
      });
      setIsQRISModalOpen(true);
    } catch (err) {
      setError(orderErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const [hasPaid, setHasPaid] = useState(false);

  const handlePaymentSuccess = () => {
    setHasPaid(true);
  };

  const handleModalClose = () => {
    setIsQRISModalOpen(false);
    if (hasPaid) {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f0f2f5]">
      <Header />

      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Header Title */}
        <div className="text-center space-y-2">
          <span className="px-3 py-1 rounded-lg bg-[#eef5fc] text-[#3390ec] text-xs font-bold uppercase tracking-wider">
            Form Pendaftaran
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1c242b] tracking-tight">
            Pasang & Promosikan Bot Telegram Kamu
          </h1>
          <p className="text-xs sm:text-sm text-[#707579]">
            Listing bot kamu langsung tayang di hadapan ribuan pengguna setelah pembayaran QRIS terkonfirmasi.
          </p>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="rounded-2xl bg-white border border-[#e4ecf2] p-6 sm:p-8 shadow-xs space-y-5">
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

          {/* Username Bot */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#1c242b]">
              Username Bot Telegram <span className="text-rose-500">*</span>
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-[#3390ec] font-mono text-sm font-bold">@</span>
              <input
                type="text"
                required
                placeholder="NamaBot_bot"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-8 pr-10 py-2.5 rounded-xl text-xs sm:text-sm text-[#1c242b] bg-[#f4f7fa] border border-[#e4ecf2] focus:outline-none focus:bg-white focus:border-[#3390ec]"
              />
              {isFetchingTg && (
                <span className="absolute right-3 text-[#3390ec]">
                  <MgcLoading size={16} />
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#707579]">
              Masukkan username bot (misal: TikGrab_Bot). Nama, foto & bio akan terisi otomatis.
            </p>

            {/* Telegram Profile Auto-Sync Preview Card */}
            {(isFetchingTg || tgFetched || avatarUrl) && username.trim().length >= 5 && (
              <div className="flex items-center gap-3 p-2.5 bg-[#eef5fc] border border-[#d2e5f8] rounded-2xl animate-in fade-in duration-200 mt-2">
                <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-white border border-[#c5def5] shrink-0 flex items-center justify-center shadow-2xs">
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
                      <MgcLoading size={15} className="text-[#3390ec]" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-[#1c242b] truncate">
                      {botName || `@${username.replace(/^@/, '')}`}
                    </span>
                    {tgFetched && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-700 text-[10px] font-bold shrink-0">
                        <MgcCheckCircle size={10} />
                        Auto-sync Telegram
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#707579] truncate">
                    {isFetchingTg
                      ? 'Mengambil foto, nama & bio dari Telegram...'
                      : description || 'Foto profil & bio otomatis terdeteksi.'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Nama Tampilan Bot (MANDATORY) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#1c242b]">
              Nama Judul Bot <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: TikGrab — Download Video TikTok HD"
              value={botName}
              onChange={(e) => setBotName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm text-[#1c242b] bg-[#f4f7fa] border border-[#e4ecf2] focus:outline-none focus:bg-white focus:border-[#3390ec]"
            />
          </div>

          {/* Kategori */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#1c242b]">
              Kategori Bot <span className="text-rose-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as BotCategory)}
              className="w-full px-4 py-2.5 rounded-xl text-xs text-[#1c242b] bg-[#f4f7fa] border border-[#e4ecf2] focus:outline-none focus:bg-white focus:border-[#3390ec]"
            >
              {BOT_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Deskripsi Singkat (Maks 150 Karakter) */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-bold text-[#1c242b]">
                Deskripsi Singkat Fitur <span className="text-[#707579] font-normal text-[11px]">(Opsional)</span>
              </label>
              <span className={`text-[10px] font-mono font-semibold ${description.length >= 140 ? 'text-amber-600 font-bold' : 'text-[#707579]'}`}>
                {description.length}/150 karakter
              </span>
            </div>
            <textarea
              rows={3}
              maxLength={150}
              placeholder="Jelaskan fungsi bot dan keunggulan fitur yang kamu tawarkan (maksimal 150 karakter)..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm text-[#1c242b] bg-[#f4f7fa] border border-[#e4ecf2] focus:outline-none focus:bg-white focus:border-[#3390ec] resize-none"
            />
          </div>

          {/* Stepper Nominal Sponsor */}
          <div className="space-y-2 pt-2 border-t border-[#e4ecf2]">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-bold text-[#1c242b]">
                Nominal Sponsor Awal
              </label>
              <span className="text-[11px] text-[#707579]">Minimal Rp10.000</span>
            </div>

            <div className="flex items-center justify-between gap-2 p-2 bg-[#f4f7fa] rounded-2xl border border-[#e4ecf2] focus-within:border-[#3390ec] focus-within:bg-white">
              <button
                type="button"
                onClick={() => handleDecrease(10000)}
                className="w-8 h-8 rounded-xl bg-white hover:bg-[#eef5fc] text-[#3390ec] flex items-center justify-center font-bold shadow-2xs cursor-pointer active:scale-95 border border-[#d2e5f8] shrink-0"
              >
                <MgcSubtract size={14} />
              </button>

              <div className="text-center flex-1">
                <span className="font-mono text-xl sm:text-2xl text-[#3390ec] font-black">
                  Rp {amount.toLocaleString('id-ID')}
                </span>
                <span className="block text-[10px] text-[#3390ec] font-semibold pt-0.5">
                  Mendapatkan Peringkat #{projectedRank}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleIncrease(10000)}
                className="w-8 h-8 rounded-xl bg-white hover:bg-[#eef5fc] text-[#3390ec] flex items-center justify-center font-bold shadow-2xs cursor-pointer active:scale-95 border border-[#d2e5f8] shrink-0"
              >
                <MgcAdd size={14} />
              </button>
            </div>

            {/* Quick Chips */}
            <div className="grid grid-cols-4 gap-2 pt-1">
              {[25000, 50000, 100000, 250000].map((val) => (
                <button
                  type="button"
                  key={val}
                  onClick={() => setAmount(val)}
                  className={`py-1.5 rounded-lg text-xs font-mono font-bold border transition-all cursor-pointer ${
                    amount === val
                      ? 'bg-[#3390ec] text-white border-[#3390ec] shadow-xs'
                      : 'bg-white text-[#707579] border-[#e4ecf2] hover:bg-[#eef5fc] hover:text-[#3390ec]'
                  }`}
                >
                  Rp{val / 1000}k
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          {error && <p className="text-xs text-rose-600 font-semibold">{error}</p>}
          <button
            type="submit"
            disabled={isSubmitting || !username.trim() || !botName.trim() || amount < 10000}
            className="w-full py-3.5 rounded-xl bg-[#3390ec] hover:bg-[#2481cc] active:scale-98 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer mt-4 disabled:opacity-50"
          >
            <span>Lanjut Bayar QRIS Instan</span>
            <span className="font-mono text-amber-200 font-black">
              Rp {amount.toLocaleString('id-ID')}
            </span>
            <MgcArrowRight size={15} />
          </button>
        </form>
      </main>

      <Footer />

      {pendingOrder && (
        <PayKitaQRISModal
          isOpen={isQRISModalOpen}
          onClose={handleModalClose}
          orderData={pendingOrder}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
