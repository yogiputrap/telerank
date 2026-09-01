'use client';

import React, { useState } from 'react';
import {
  MgcMessage,
  MgcQuestion,
  MgcClose,
  MgcCheckCircle,
  MgcTelegram,
  MgcExternalLink,
  MgcArrowRight,
  MgcHeadphone,
  MgcLightbulb,
  MgcBug,
} from './MingCuteIcons';
import { useLockBodyScroll } from '../lib/useLockBodyScroll';

const FAQS = [
  {
    q: 'Bagaimana cara menaikkan bot ke peringkat #1?',
    a: 'Peringkat ditentukan secara transparan berdasarkan nominal sponsor tertinggi. Kamu cukup klik "Rebut posisi ini" dan bayar minimal +Rp1 lebih tinggi dari bot di posisi tersebut.',
  },
  {
    q: 'Berapa lama status bot aktif setelah bayar QRIS?',
    a: 'Proses verifikasi pembayaran QRIS berlangsung instan secara otomatis (1–5 detik). Begitu QRIS sukses terbayar, posisi bot kamu langsung terupdate seketika di leaderboard.',
  },
  {
    q: 'Apakah listing bot di TeleRank ada biaya bulanan?',
    a: 'Tidak ada biaya bulanan. Kamu hanya membayar nominal sponsor sekali saat mendaftar atau saat ingin menaikkan/merebut peringkat.',
  },
  {
    q: 'Bagaimana jika bot saya digeser oleh developer lain?',
    a: 'Bot kamu hanya akan turun 1 peringkat di bawahnya (misal dari #1 menjadi #2). Kamu bisa menambah sponsor kapan saja untuk merebut kembali posisi puncak!',
  },
];

export const FloatingFeedbackSupport: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  useLockBodyScroll(isOpen);

  const [activeTab, setActiveTab] = useState<'FEEDBACK' | 'HELP'>('FEEDBACK');

  // Feedback form state
  const [feedbackType, setFeedbackType] = useState('SARAN');
  const [telegramHandle, setTelegramHandle] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // FAQ Accordion open index
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    try {
      const response = await fetch('/api/feedback', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ feedbackType, telegramHandle, message }) });
      if (!response.ok) throw new Error('FEEDBACK_FAILED');
      setIsSubmitted(true);
      setTimeout(() => { setMessage(''); setTelegramHandle(''); }, 1000);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {/* 1. Floating Action Button (FAB) on Bottom-Right */}
      <div className="fixed bottom-5 right-5 z-40 flex items-center">
        <button
          onClick={() => {
            setIsOpen(true);
            setIsSubmitted(false);
          }}
          className="group relative flex items-center gap-2 px-3.5 sm:px-4 py-3 rounded-xl bg-[#3390ec] hover:bg-[#2481cc] active:scale-95 text-white font-bold text-xs sm:text-sm shadow-xl shadow-[#3390ec]/30 border border-white/40 backdrop-blur-xl transition-all duration-300 cursor-pointer"
          title="Bantuan & Masukan"
        >
          {/* Pulse Indicator */}
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 border-2 border-white rounded-full animate-ping" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 border-2 border-white rounded-full" />

          <MgcMessage size={18} className="group-hover:rotate-12 transition-transform" />
          <span className="hidden sm:inline font-black tracking-tight">
            Bantuan & Masukan
          </span>
          <span className="sm:hidden font-bold">Bantuan</span>
        </button>
      </div>

      {/* 2. Interactive Dialog Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overscroll-contain touch-none animate-in fade-in duration-200"
          onClick={(e) => { if (e.target === e.currentTarget) setIsOpen(false); }}
        >
          <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto overscroll-contain touch-auto no-scrollbar rounded-2xl bg-white border border-[#e4ecf2] p-5 sm:p-7 shadow-2xl space-y-4">
            {/* Modal Top Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#e4ecf2]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#eef5fc] text-[#3390ec] flex items-center justify-center font-bold text-xs shrink-0">
                  <MgcHeadphone size={18} />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-[#1c242b]">
                    Pusat Bantuan & Masukan
                  </h3>
                  <p className="text-[11px] text-[#707579]">
                    Kritik, saran fitur, lapor kendala, atau tanya admin
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl text-[#707579] hover:text-[#1c242b] hover:bg-[#f4f7fa] transition-all cursor-pointer shrink-0"
              >
                <MgcClose size={18} />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex items-center p-1 bg-[#f4f7fa] rounded-2xl border border-[#e4ecf2]">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('FEEDBACK');
                  setIsSubmitted(false);
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'FEEDBACK'
                    ? 'bg-white text-[#3390ec] shadow-xs'
                    : 'text-[#707579] hover:text-[#1c242b]'
                }`}
              >
                <MgcMessage size={14} />
                <span>Kirim Masukan</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('HELP')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'HELP'
                    ? 'bg-white text-[#3390ec] shadow-xs'
                    : 'text-[#707579] hover:text-[#1c242b]'
                }`}
              >
                <MgcQuestion size={14} />
                <span>Bantuan & FAQ</span>
              </button>
            </div>

            {/* TAB 1: FORM MASUKAN (FEEDBACK) */}
            {activeTab === 'FEEDBACK' && (
              <div className="space-y-3.5">
                {isSubmitted ? (
                  <div className="text-center py-6 space-y-2 animate-in zoom-in-95 duration-300">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                      <MgcCheckCircle size={30} />
                    </div>
                    <h4 className="text-sm font-bold text-[#1c242b]">Masukan Berhasil Terkirim!</h4>
                    <p className="text-xs text-[#707579] max-w-xs mx-auto">
                      Terima kasih atas saran dan masukannya. Tim kami akan terus mengembangkan TeleRank agar semakin bermanfaat!
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsSubmitted(false)}
                      className="mt-2 text-xs font-bold text-[#3390ec] hover:underline"
                    >
                      Kirim masukan lainnya
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitFeedback} className="space-y-3 text-xs">
                    {/* Tipe Masukan */}
                    <div className="space-y-1">
                      <label className="block font-bold text-[#1c242b]">
                        Jenis Masukan <span className="text-rose-500">*</span>
                      </label>
                      <div className="grid grid-cols-3 gap-1.5">
                        {[
                          { id: 'SARAN', label: 'Saran Fitur', icon: <MgcLightbulb size={13} className="inline mr-1" /> },
                          { id: 'BUG', label: 'Lapor Bug', icon: <MgcBug size={13} className="inline mr-1" /> },
                          { id: 'LAINNYA', label: 'Lainnya', icon: <MgcMessage size={13} className="inline mr-1" /> },
                        ].map((item) => (
                          <button
                            type="button"
                            key={item.id}
                            onClick={() => setFeedbackType(item.id)}
                            className={`py-2 px-2 rounded-xl text-center font-bold border transition-all cursor-pointer text-[11px] flex items-center justify-center gap-1 ${
                              feedbackType === item.id
                                ? 'bg-[#eef5fc] border-[#3390ec] text-[#3390ec]'
                                : 'bg-[#f4f7fa] border-[#e4ecf2] text-[#707579] hover:bg-white'
                            }`}
                          >
                            {item.icon}
                            <span>{item.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Kontak Telegram (Opsional) */}
                    <div className="space-y-1">
                      <label className="block font-bold text-[#1c242b]">
                        Kontak Telegram Kamu <span className="text-[#707579] font-normal text-[11px]">(Opsional, untuk balasan tim)</span>
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3 text-[#3390ec] font-mono text-sm font-bold">@</span>
                        <input
                          type="text"
                          placeholder="username_kamu"
                          value={telegramHandle}
                          onChange={(e) => setTelegramHandle(e.target.value)}
                          className="w-full pl-8 pr-3.5 py-2.5 rounded-xl text-xs text-[#1c242b] bg-[#f4f7fa] border border-[#e4ecf2] focus:outline-none focus:bg-white focus:border-[#3390ec]"
                        />
                      </div>
                    </div>

                    {/* Isi Pesan / Masukan */}
                    <div className="space-y-1">
                      <label className="block font-bold text-[#1c242b]">
                        Pesan & Masukan Kamu <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        required
                        rows={3}
                        placeholder="Tuliskan saran perbaikan fitur, ide baru, atau kendala yang kamu alami..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl text-xs text-[#1c242b] bg-[#f4f7fa] border border-[#e4ecf2] focus:outline-none focus:bg-white focus:border-[#3390ec]"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={!message.trim()}
                      className="w-full py-3 rounded-xl bg-[#3390ec] hover:bg-[#2481cc] active:scale-98 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                    >
                      <span>Kirim Masukan Sekarang</span>
                      <MgcArrowRight size={14} />
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* TAB 2: PUSAT BANTUAN & FAQ */}
            {activeTab === 'HELP' && (
              <div className="space-y-3 text-xs">
                {/* Accordions */}
                <div className="space-y-2">
                  {FAQS.map((faq, index) => {
                    const isFaqOpen = openFaq === index;
                    return (
                      <div
                        key={index}
                        className="rounded-2xl border border-[#e4ecf2] bg-[#f4f7fa] overflow-hidden transition-all"
                      >
                        <button
                          type="button"
                          onClick={() => setOpenFaq(isFaqOpen ? null : index)}
                          className="w-full p-3 text-left font-bold text-[#1c242b] flex items-center justify-between gap-2 hover:bg-[#eef5fc] transition-colors cursor-pointer"
                        >
                          <span>{faq.q}</span>
                          <span className="text-[#3390ec] font-mono text-sm shrink-0">
                            {isFaqOpen ? '−' : '+'}
                          </span>
                        </button>
                        {isFaqOpen && (
                          <div className="px-3.5 pb-3 text-[#707579] leading-relaxed border-t border-[#e4ecf2]/60 pt-2 bg-white text-[11px]">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Direct Telegram Support Banner */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-[#3390ec] to-[#2481cc] text-white space-y-2 shadow-xs">
                  <div className="flex items-center gap-2">
                    <MgcTelegram size={20} />
                    <span className="font-black text-sm">Perlu Bantuan Langsung?</span>
                  </div>
                  <p className="text-[11px] text-blue-100 leading-relaxed">
                    Hubungi tim kami langsung di Telegram jika ada kendala pembayaran atau verifikasi bot.
                  </p>
                  <a
                    href="https://t.me"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-[#3390ec] font-bold text-xs hover:bg-blue-50 active:scale-95 transition-all shadow-xs"
                  >
                    <span>Chat Admin @telerank_id</span>
                    <MgcExternalLink size={13} />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
