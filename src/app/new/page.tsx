'use client';

import React, { useState } from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { PayKitaQRISModal } from '../../components/PayKitaQRISModal';
import { MgcArrowRight, MgcSubtract, MgcAdd } from '../../components/MingCuteIcons';
import { BotCategory, BOT_CATEGORIES } from '../../types';

export default function NewListingPage() {
  const [username, setUsername] = useState('');
  const [botName, setBotName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<BotCategory>('DOWNLOADER');
  const [tagline, setTagline] = useState('');
  const [amount, setAmount] = useState<number>(50000);

  const [isQRISModalOpen, setIsQRISModalOpen] = useState(false);
  const [pendingOrder, setPendingOrder] = useState<any>(null);

  const handleDecrease = (val: number) => {
    setAmount((prev) => Math.max(10000, prev - val));
  };

  const handleIncrease = (val: number) => {
    setAmount((prev) => prev + val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUsername = username.replace('https://t.me/', '').replace('@', '').trim();
    if (!cleanUsername || amount < 10000) return;

    const orderId = `TR-${Math.floor(100000 + Math.random() * 900000)}`;

    setPendingOrder({
      orderId,
      botName: botName || `${cleanUsername} Bot`,
      telegramUsername: cleanUsername,
      amount,
      payAmount: amount,
      qrisString: `00020101021226590014ID.LINKAJA.WWW01189360091438202812080215081234567890520458125303360540${amount}5802ID5910TELERANK_ID6007JAKARTA62070703A016304E8A9`,
      targetBotData: {
        telegram_username: cleanUsername,
        bot_name: botName || `${cleanUsername} Bot`,
        description: description || 'Bot baru terverifikasi di TeleRank',
        category,
        custom_tagline: tagline || '',
      },
    });

    setIsQRISModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f0f2f5]">
      <Header />

      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Header Title */}
        <div className="text-center space-y-2">
          <span className="px-3 py-1 rounded-full bg-[#eef5fc] text-[#3390ec] text-xs font-bold uppercase tracking-wider">
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
        <form onSubmit={handleSubmit} className="rounded-3xl bg-white border border-[#e4ecf2] p-6 sm:p-8 shadow-xs space-y-5">
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
                className="w-full pl-8 pr-4 py-2.5 rounded-xl text-xs sm:text-sm text-[#1c242b] bg-[#f4f7fa] border border-[#e4ecf2] focus:outline-none focus:bg-white focus:border-[#3390ec]"
              />
            </div>
            <p className="text-[11px] text-[#707579]">Masukkan username bot tanpa spasi (misal: TikGrab_Bot).</p>
          </div>

          {/* Nama Tampilan Bot */}
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

          {/* Kategori (100% Identik dengan Homepage) */}
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

          {/* Deskripsi Singkat */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#1c242b]">
              Deskripsi Singkat Fitur <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              placeholder="Jelaskan fungsi bot dan keunggulan fitur yang kamu tawarkan..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm text-[#1c242b] bg-[#f4f7fa] border border-[#e4ecf2] focus:outline-none focus:bg-white focus:border-[#3390ec]"
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
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-[#3390ec] hover:bg-[#2481cc] active:scale-98 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer mt-4"
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
          onClose={() => setIsQRISModalOpen(false)}
          orderData={pendingOrder}
          onPaymentSuccess={() => {
            alert('Pembayaran berhasil! Bot kamu telah aktif di TeleRank.');
            window.location.href = '/';
          }}
        />
      )}
    </div>
  );
}
