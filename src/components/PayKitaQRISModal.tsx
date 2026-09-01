'use client';

import React, { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  MgcClose,
  MgcShield,
  MgcTime,
  MgcCheckCircle,
  MgcCopy,
  MgcCheck,
  MgcFlash,
  MgcTelegram,
  MgcDownload,
  MgcFilePdf,
  MgcLoading,
  MgcArrowRight,
} from './MingCuteIcons';
import { generateInvoicePDF } from '../lib/invoiceGenerator';
import { useLockBodyScroll } from '../lib/useLockBodyScroll';

interface PayKitaQRISModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderData: {
    orderId: string;
    botName: string;
    telegramUsername: string;
    category?: string;
    amount: number;
    payAmount: number;
    qrisString: string;
    expiresAt: string;
    checkoutUrl?: string | null;
    sandbox?: boolean;
    paidAt?: string;
  };
  onPaymentSuccess: () => void;
}

export const PayKitaQRISModal: React.FC<PayKitaQRISModalProps> = ({
  isOpen,
  onClose,
  orderData,
  onPaymentSuccess,
}) => {
  useLockBodyScroll(isOpen);
  const [timeLeft, setTimeLeft] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [paidTimestamp, setPaidTimestamp] = useState<string | null>(null);
  const [isExpired, setIsExpired] = useState(false);
  const [isSandboxConfirming, setIsSandboxConfirming] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [pdfDownloaded, setPdfDownloaded] = useState(false);
  const successHandledRef = useRef(false);

  useEffect(() => {
    if (!isOpen) return;
    setIsPaid(false);
    setIsExpired(false);
    setPaidTimestamp(null);
    setPdfDownloaded(false);
    successHandledRef.current = false;

    const tick = () => {
      const remainingMs = new Date(orderData.expiresAt).getTime() - Date.now();
      const leftSec = Math.max(0, Math.floor(remainingMs / 1000));
      setTimeLeft(leftSec);
      if (remainingMs <= 0) {
        setIsExpired(true);
      }
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [isOpen, orderData.expiresAt]);

  useEffect(() => {
    if (!isOpen || isPaid || isExpired) return;
    let cancelled = false;

    const poll = async () => {
      try {
        const response = await fetch(`/api/orders/${orderData.orderId}`);
        if (!response.ok) return;
        const result = await response.json();
        if (cancelled || successHandledRef.current) return;

        if (result.data?.status === 'paid') {
          successHandledRef.current = true;
          setPaidTimestamp(result.data?.paid_at || new Date().toISOString());
          setIsPaid(true);
          try {
            const confettiMod = await import('canvas-confetti');
            const confetti = confettiMod.default || confettiMod;
            confetti({
              particleCount: 120,
              spread: 80,
              origin: { y: 0.55 },
            });
          } catch {
            // ignore
          }
          // Notify parent data refresh
          onPaymentSuccess();
        } else if (result.data?.status === 'expired' || result.data?.status === 'cancelled') {
          setIsExpired(true);
        }
      } catch (error) {
        console.error('QRIS status check error:', error);
      }
    };

    const interval = setInterval(poll, 2500);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [isOpen, isPaid, isExpired, orderData.orderId, onPaymentSuccess]);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const handleSandboxConfirm = async () => {
    if (isSandboxConfirming || isExpired) return;
    setIsSandboxConfirming(true);
    try {
      const response = await fetch('/api/payments/sandbox/confirm', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ orderId: orderData.orderId }),
      });
      if (!response.ok) throw new Error('SANDBOX_CONFIRM_FAILED');
      const statusRes = await fetch(`/api/orders/${orderData.orderId}`);
      if (statusRes.ok) {
        const result = await statusRes.json();
        if (result.data?.status === 'paid') {
          successHandledRef.current = true;
          setPaidTimestamp(result.data?.paid_at || new Date().toISOString());
          setIsPaid(true);
          try {
            const confettiMod = await import('canvas-confetti');
            const confetti = confettiMod.default || confettiMod;
            confetti({
              particleCount: 120,
              spread: 80,
              origin: { y: 0.55 },
            });
          } catch {
            // ignore
          }
          onPaymentSuccess();
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSandboxConfirming(false);
    }
  };

  const handleCopyAmount = () => {
    navigator.clipboard.writeText(orderData.payAmount.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadInvoice = async () => {
    setIsDownloadingPdf(true);
    try {
      await generateInvoicePDF({
        orderId: orderData.orderId,
        botName: orderData.botName,
        telegramUsername: orderData.telegramUsername,
        category: orderData.category,
        amount: orderData.amount,
        payAmount: orderData.payAmount,
        paidAt: paidTimestamp || new Date().toISOString(),
      });
      setPdfDownloaded(true);
      setTimeout(() => setPdfDownloaded(false), 3500);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handleFinish = () => {
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overscroll-contain touch-none animate-in fade-in duration-200"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-md max-h-[94vh] overflow-y-auto overscroll-contain touch-auto no-scrollbar rounded-2xl bg-white border border-[#e4ecf2] p-4 sm:p-6 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#e4ecf2]">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
              isPaid
                ? 'bg-emerald-50 text-emerald-600'
                : isExpired
                ? 'bg-rose-50 text-rose-600'
                : 'bg-[#eef5fc] text-[#3390ec]'
            }`}>
              {isPaid ? <MgcCheckCircle size={18} /> : <MgcTelegram size={18} />}
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1c242b]">
                {isPaid
                  ? 'Pembayaran Sukses'
                  : isExpired
                  ? 'Waktu Pembayaran Habis'
                  : 'Pembayaran QRIS Instan'}
              </h3>
              <p className="text-[11px] text-[#707579]">
                {isPaid
                  ? 'Transaksi terverifikasi & peringkat bot aktif'
                  : isExpired
                  ? 'Order pembayaran telah kedaluwarsa'
                  : 'Scan QRIS via BCA, Mandiri, GoPay, OVO, Dana'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#707579] hover:text-[#1c242b] hover:bg-[#f4f7fa] transition-all cursor-pointer"
            title="Tutup / Batalkan"
          >
            <MgcClose size={18} />
          </button>
        </div>

        {/* SUKSES PAID STATE */}
        {isPaid ? (
          <div className="py-2 space-y-4 animate-in zoom-in-95 duration-300">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border-2 border-emerald-200 shadow-sm">
                <MgcCheckCircle size={40} />
              </div>
              <h4 className="text-lg font-black text-[#1c242b]">Pembayaran Berhasil!</h4>
              <p className="text-xs text-[#707579] max-w-xs mx-auto">
                Order <span className="font-mono font-bold text-[#3390ec]">{orderData.orderId}</span> telah diverifikasi otomatis.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="bg-[#f4f7fa] rounded-2xl p-4 border border-[#e4ecf2] space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-[#707579]">Bot Telegram:</span>
                <span className="font-bold text-[#1c242b]">@{orderData.telegramUsername.replace('@', '')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#707579]">Nomor Order:</span>
                <span className="font-mono font-semibold text-[#707579]">{orderData.orderId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#707579]">Waktu Bayar:</span>
                <span className="text-[#1c242b] font-medium">
                  {paidTimestamp
                    ? new Date(paidTimestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB'
                    : 'Baru saja'}
                </span>
              </div>
              <div className="pt-2 border-t border-[#e4ecf2] flex justify-between items-center">
                <span className="font-bold text-[#1c242b]">Total Terbayar:</span>
                <span className="text-base font-black font-mono text-emerald-600">
                  Rp {orderData.payAmount.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handleDownloadInvoice}
                disabled={isDownloadingPdf}
                className="w-full py-3 rounded-xl bg-white hover:bg-[#eef5fc] border-2 border-[#3390ec] text-[#3390ec] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer active:scale-98"
              >
                {isDownloadingPdf ? (
                  <>
                    <MgcLoading size={16} />
                    <span>Menyiapkan Dokumen PDF...</span>
                  </>
                ) : pdfDownloaded ? (
                  <>
                    <MgcCheck size={16} className="text-emerald-600" />
                    <span className="text-emerald-600">Invoice Berhasil Diunduh!</span>
                  </>
                ) : (
                  <>
                    <MgcFilePdf size={16} />
                    <MgcDownload size={15} />
                    <span>Download Invoice (.pdf)</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleFinish}
                className="w-full py-3 rounded-xl bg-[#3390ec] hover:bg-[#2481cc] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-98"
              >
                <span>Selesai & Lihat Ranking</span>
                <MgcArrowRight size={15} />
              </button>
            </div>
          </div>
        ) : isExpired ? (
          /* EXPIRED STATE */
          <div className="text-center py-6 space-y-4 animate-in zoom-in-95 duration-300">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
              <MgcTime size={32} />
            </div>
            <div className="space-y-1">
              <h4 className="text-lg font-bold text-[#1c242b]">Waktu Pembayaran Habis</h4>
              <p className="text-xs text-[#707579] max-w-xs mx-auto">
                Order <span className="font-mono font-bold text-[#1c242b]">{orderData.orderId}</span> sudah kedaluwarsa. Silakan tutup dan buat order baru.
              </p>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-[#3390ec] hover:bg-[#2481cc] text-white font-bold text-xs transition-all cursor-pointer"
              >
                Tutup & Buat Order Baru
              </button>
            </div>
          </div>
        ) : (
          /* ACTIVE QRIS PAYMENT STATE */
          <>
            {/* Real-time active auto-checking status bar */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#eef5fc] border border-[#d2e5f8]">
              <div className="flex items-center gap-2.5">
                <div className="relative flex items-center justify-center w-3.5 h-3.5">
                  <span className="absolute w-3.5 h-3.5 rounded-full bg-[#3390ec] animate-ping opacity-75" />
                  <span className="relative w-2 h-2 rounded-full bg-[#3390ec]" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-[#1c242b] flex items-center gap-1.5">
                    <span>Mengecek Pembayaran...</span>
                    <MgcLoading size={13} className="text-[#3390ec]" />
                  </div>
                  <p className="text-[10px] text-[#707579]">Sistem memverifikasi QRIS secara real-time</p>
                </div>
              </div>
              <div className="text-right font-mono text-xs font-bold text-[#3390ec]">
                <span className="flex items-center gap-1">
                  <MgcTime size={13} />
                  {formattedTime}
                </span>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-[#f4f7fa] rounded-2xl p-3.5 border border-[#e4ecf2] space-y-1.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-[#707579]">Bot Telegram:</span>
                <span className="font-mono font-bold text-[#1c242b]">@{orderData.telegramUsername.replace('@', '')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#707579]">Order ID:</span>
                <span className="font-mono text-[#707579]">{orderData.orderId}</span>
              </div>
              <div className="pt-2 border-t border-[#e4ecf2] flex justify-between items-center">
                <span className="font-semibold text-[#1c242b]">Total Pembayaran:</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-black font-mono text-[#3390ec]">
                    Rp {orderData.payAmount.toLocaleString('id-ID')}
                  </span>
                  <button
                    onClick={handleCopyAmount}
                    className="p-1 text-[#707579] hover:text-[#1c242b] cursor-pointer"
                    title="Salin Nominal"
                  >
                    {copied ? <MgcCheck size={14} className="text-emerald-600" /> : <MgcCopy size={14} />}
                  </button>
                </div>
              </div>
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-[#e4ecf2] shadow-xs space-y-2">
              <div className="p-2 bg-white rounded-xl shadow-2xs border border-[#e4ecf2]">
                <QRCodeSVG
                  value={orderData.qrisString}
                  size={175}
                  level="H"
                  includeMargin={false}
                />
              </div>
              <div className="text-[10px] font-bold text-[#707579] uppercase text-center tracking-wide">
                BCA • Mandiri • GoPay • OVO • Dana • ShopeePay
              </div>
            </div>

            {/* Verification Security Note */}
            <div className="flex items-center justify-center gap-1 text-[11px] text-[#707579]">
              <MgcShield size={13} className="text-emerald-600" />
              <span>Verifikasi otomatis dalam hitungan detik setelah bayar</span>
            </div>

            {/* Cancel & Sandbox Actions */}
            <div className="pt-1 space-y-2">
              {/* Cancel Button */}
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-[#f4f7fa] hover:bg-[#eef2f6] text-[#707579] hover:text-rose-600 font-semibold text-xs transition-all cursor-pointer border border-[#e4ecf2]"
              >
                Batalkan Pembayaran
              </button>

              {/* Dev-only simulation button */}
              {(orderData.sandbox || process.env.NODE_ENV !== 'production') && (
                <button
                  type="button"
                  onClick={handleSandboxConfirm}
                  disabled={isSandboxConfirming}
                  className="w-full py-2.5 rounded-xl bg-[#3390ec] hover:bg-[#2481cc] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-98 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSandboxConfirming ? (
                    <span>Memverifikasi Pembayaran...</span>
                  ) : (
                    <>
                      <MgcFlash size={14} />
                      <span>[DEV] Simulasikan Pembayaran Sukses</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
