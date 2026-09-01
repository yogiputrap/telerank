import React, { useState } from 'react';
import { X, Bot as BotIcon, Sparkles, ArrowRight } from 'lucide-react';
import { MgcWarning } from './MingCuteIcons';
import { usernameError } from '../lib/orderErrors';
import { useLockBodyScroll } from '../lib/useLockBodyScroll';
import { Bot, BotCategory, BOT_CATEGORIES } from '../types';

interface SubmitBotModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBots: Bot[];
  onProceedToPayment: (botData: Partial<Bot>, amount: number) => void;
}

const PRESET_AMOUNTS = [1000, 5000, 10000, 25000, 50000, 100000];

export const SubmitBotModal: React.FC<SubmitBotModalProps> = ({
  isOpen,
  onClose,
  currentBots,
  onProceedToPayment,
}) => {
  useLockBodyScroll(isOpen);

  const [telegramUsername, setTelegramUsername] = useState('');
  const [botName, setBotName] = useState('');
  const [description, setDescription] = useState('');
  const [customTagline, setCustomTagline] = useState('');
  const [category, setCategory] = useState<BotCategory>('DOWNLOADER');
  const [contactHandle, setContactHandle] = useState('');
  const defaultRec = currentBots[0]?.total_bid_amount ? Math.max(1000, currentBots[0].total_bid_amount + 1) : 1000;
  const [bidAmount, setBidAmount] = useState<number>(defaultRec);
  const [customAmountStr, setCustomAmountStr] = useState('');
  const [isCheckingBot, setIsCheckingBot] = useState(false);
  const [botChecked, setBotChecked] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80');

  const [usernameErr, setUsernameErr] = useState('');

  React.useEffect(() => {
    if (isOpen) {
      const rec = currentBots[0]?.total_bid_amount ? Math.max(1000, currentBots[0].total_bid_amount + 1) : 1000;
      setBidAmount(rec);
      setCustomAmountStr('');
    }
  }, [isOpen, currentBots]);

  if (!isOpen) return null;

  const handleCheckBot = () => {
    const cleanUsername = telegramUsername.replace(/^https?:\/\/t\.me\//i, '').replace(/^@/, '').trim();
    if (!cleanUsername) return;
    const err = usernameError(cleanUsername);
    if (err) {
      setUsernameErr(err);
      return;
    }
    setUsernameErr('');

    setIsCheckingBot(true);
    setTimeout(() => {
      setIsCheckingBot(false);
      setBotChecked(true);
      if (!botName) {
        setBotName(`${cleanUsername.replace(/_bot$/i, '')} Assistant`);
      }
      if (!description) {
        setDescription(`Bot Telegram resmi @${cleanUsername} untuk memberikan layanan cepat dan otomatis 24 jam.`);
      }
      setAvatarUrl(`https://api.dicebear.com/7.x/bottts/svg?seed=${cleanUsername}`);
    }, 800);
  };

  const predictedRank = (() => {
    const amount = Number(bidAmount) || 0;
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUsername = telegramUsername.replace(/^https?:\/\/t\.me\//i, '').replace(/^@/, '').trim();
    if (!cleanUsername) return;
    const err = usernameError(cleanUsername);
    if (err) {
      setUsernameErr(err);
      return;
    }
    setUsernameErr('');

    const newBotData: Partial<Bot> = {
      telegram_username: cleanUsername,
      bot_name: botName || cleanUsername,
      avatar_url: avatarUrl,
      description: description || `Bot @${cleanUsername} terverifikasi di TeleRank`,
      category,
      custom_tagline: customTagline,
      contact_handle: contactHandle || '08123456789',
      is_verified: false,
      is_online: true,
      daily_clicks: 0,
    };

    onProceedToPayment(newBotData, bidAmount);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overscroll-contain touch-none animate-in fade-in duration-200"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto overscroll-contain touch-auto no-scrollbar rounded-2xl bg-white border border-slate-200 p-5 sm:p-8 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600 font-bold text-sm shadow-xs">
              <BotIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Daftarkan & Promosikan Bot</h3>
              <p className="text-xs text-slate-400">Raih peringkat atas & jangkau ribuan pengguna Telegram baru</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          {/* Step 1: Telegram Username */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Username Bot Telegram <span className="text-rose-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-teal-600 font-mono font-bold">@</span>
                <input
                  type="text"
                  required
                  placeholder="NamaBotKamu_bot (wajib akhiran 'bot')"
                  value={telegramUsername}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/^https?:\/\/t\.me\//i, '').replace(/^@/, '');
                    setTelegramUsername(raw);
                    setBotChecked(false);
                    if (raw.length >= 3 && !/bot$/i.test(raw)) {
                      setUsernameErr('Username bot harus berakhiran kata "bot" (contoh: @NamaBot) agar bukan akun pribadi/channel/grup.');
                    } else {
                      setUsernameErr('');
                    }
                  }}
                  className="w-full pl-8 pr-3 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-teal-500"
                />
              </div>
              <button
                type="button"
                onClick={handleCheckBot}
                disabled={isCheckingBot || !telegramUsername || Boolean(usernameError(telegramUsername))}
                className="px-4 py-2.5 rounded-2xl bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-700 font-bold text-xs whitespace-nowrap active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isCheckingBot ? 'Mengecek...' : botChecked ? 'Terverifikasi' : 'Cek Bot'}
              </button>
            </div>
            {usernameErr && (
              <p className="text-xs text-rose-600 font-semibold flex items-center gap-1 pt-0.5">
                <MgcWarning size={13} className="shrink-0" />
                <span>{usernameErr}</span>
              </p>
            )}
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">Nama Bot Tampilan</label>
              <input
                type="text"
                placeholder="TikGrab HD Downloader"
                value={botName}
                onChange={(e) => setBotName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:bg-white focus:border-teal-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">Kategori Bot</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as BotCategory)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:bg-white focus:border-teal-500"
              >
                {BOT_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">Deskripsi Singkat</label>
            <textarea
              rows={2}
              placeholder="Jelaskan fitur unggulan bot kamu..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:bg-white focus:border-teal-500 resize-none"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">Tagline Singkat (Opsional)</label>
            <input
              type="text"
              placeholder="Contoh: Download TikTok 0.2 detik tanpa watermark!"
              value={customTagline}
              onChange={(e) => setCustomTagline(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:bg-white focus:border-teal-500"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">
              WhatsApp / Username Telegram (Notifikasi Outbid) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="08123456789 atau @username_kamu"
              value={contactHandle}
              onChange={(e) => setContactHandle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:bg-white focus:border-teal-500"
            />
          </div>

          {/* Bid Amount Selection */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="block text-xs font-semibold text-slate-700">Pilih Nominal Sponsor (Bid Awal)</label>
            <div className="grid grid-cols-3 gap-2">
              {PRESET_AMOUNTS.map((amt) => {
                const isSelected = bidAmount === amt;
                const amtStyle = isSelected
                  ? "bg-teal-600 text-white font-extrabold shadow-sm border-teal-600"
                  : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold";
                return (
                  <button
                    type="button"
                    key={amt}
                    onClick={() => {
                      setBidAmount(amt);
                      setCustomAmountStr('');
                    }}
                    className={`py-2 px-1 rounded-2xl text-xs border transition-all cursor-pointer ${amtStyle}`}
                  >
                    Rp {amt.toLocaleString('id-ID')}
                  </button>
                );
              })}
            </div>

            {/* Custom Amount */}
            <div className="relative mt-2">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">Rp</span>
              <input
                type="number"
                min={1000}
                step={1000}
                placeholder="Nominal custom..."
                value={customAmountStr}
                onChange={(e) => {
                  setCustomAmountStr(e.target.value);
                  setBidAmount(Number(e.target.value) || 0);
                }}
                className="w-full pl-10 pr-3 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-teal-500 text-xs"
              />
            </div>
          </div>

          {/* Realtime Position Simulator */}
          <div className="rounded-2xl p-3.5 bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-600 shrink-0" />
              <span className="text-slate-700 font-medium">Proyeksi Ranking:</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium text-slate-500">Menempati:</span>
              <span className="px-3 py-0.5 rounded-lg bg-teal-600 text-white font-black font-mono text-sm shadow-xs">
                #{predictedRank}
              </span>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-600/25 active:scale-98 transition-all cursor-pointer"
            >
              <span>Lanjut Bayar QRIS Instan</span>
              <ArrowRight className="w-4 h-4 text-teal-200" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
