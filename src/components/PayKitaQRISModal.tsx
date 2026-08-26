'use client';

import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { MgcClose, MgcShield, MgcTime, MgcCheckCircle, MgcCopy, MgcCheck, MgcFlash, MgcTelegram } from './MingCuteIcons';
import confetti from 'canvas-confetti';

interface PayKitaQRISModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderData: {
    orderId: string;
    botName: string;
    telegramUsername: string;
    amount: number;
    payAmount: number;
    qrisString: string;
  };
  onPaymentSuccess: () => void;
}

export const PayKitaQRISModal: React.FC<PayKitaQRISModalProps> = ({
  isOpen,
  onClose,
  orderData,
  onPaymentSuccess,
}) => {
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [copied, setCopied] = useState(false);
  const [isSimulatingPaid, setIsSimulatingPaid] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const handleSimulatePayment = () => {
    setIsSimulatingPaid(true);
    setTimeout(() => {
      setIsPaid(true);
      setIsSimulatingPaid(false);
      try {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      } catch (e) {
        console.error(e);
      }
      setTimeout(() => {
        onPaymentSuccess();
        onClose();
        setIsPaid(false);
      }, 2000);
    }, 1500);
  };

  const handleCopyAmount = () => {
    navigator.clipboard.writeText(orderData.payAmount.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white border border-[#e4ecf2] p-6 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#e4ecf2]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#eef5fc] text-[#3390ec] flex items-center justify-center font-bold text-xs">
              <MgcTelegram size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1c242b]">Pembayaran QRIS Instan</h3>
              <p className="text-[11px] text-[#707579]">Proses otomatis terverifikasi 24 jam</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#707579] hover:text-[#1c242b] hover:bg-[#f4f7fa] transition-all cursor-pointer"
          >
            <MgcClose size={18} />
          </button>
        </div>

        {isPaid ? (
          <div className="text-center py-8 space-y-2 animate-in zoom-in-95 duration-300">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
              <MgcCheckCircle size={36} />
            </div>
            <h4 className="text-lg font-bold text-[#1c242b]">Pembayaran Berhasil!</h4>
            <p className="text-xs text-[#707579] max-w-xs mx-auto">
              Order <span className="font-mono font-bold text-[#3390ec]">{orderData.orderId}</span> terkonfirmasi. Bot @{orderData.telegramUsername} langsung naik peringkat!
            </p>
          </div>
        ) : (
          <>
            {/* Order Summary */}
            <div className="bg-[#f4f7fa] rounded-2xl p-3.5 border border-[#e4ecf2] space-y-1.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-[#707579]">Bot Telegram:</span>
                <span className="font-mono font-bold text-[#1c242b]">@{orderData.telegramUsername}</span>
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
                    className="p-1 text-[#707579] hover:text-[#1c242b]"
                    title="Salin"
                  >
                    {copied ? <MgcCheck size={14} className="text-emerald-600" /> : <MgcCopy size={14} />}
                  </button>
                </div>
              </div>
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-[#e4ecf2] shadow-xs">
              <QRCodeSVG
                value={orderData.qrisString}
                size={170}
                level="H"
                includeMargin={false}
              />
              <div className="mt-2 text-[10px] font-bold text-[#707579] uppercase">
                BCA • Mandiri • GoPay • OVO • Dana • ShopeePay
              </div>
            </div>

            {/* Timer */}
            <div className="flex items-center justify-between text-xs text-[#707579] px-1">
              <div className="flex items-center gap-1 text-[#3390ec] font-mono font-semibold">
                <MgcTime size={14} />
                <span>Sisa: {formattedTime}</span>
              </div>
              <div className="flex items-center gap-1 text-emerald-600 font-medium">
                <MgcShield size={14} />
                <span>Verifikasi Otomatis</span>
              </div>
            </div>

            {/* Sandbox Simulation Button */}
            <div className="pt-1">
              <button
                onClick={handleSimulatePayment}
                disabled={isSimulatingPaid}
                className="w-full py-2.5 rounded-xl bg-[#3390ec] hover:bg-[#2481cc] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-98 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSimulatingPaid ? (
                  <span>Memverifikasi Pembayaran...</span>
                ) : (
                  <>
                    <MgcFlash size={14} />
                    <span>[Demo] Simulasikan Pembayaran Sukses</span>
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
