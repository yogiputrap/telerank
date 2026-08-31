'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '../../../components/Header';
import { Footer } from '../../../components/Footer';
import { RebutPosisiModal } from '../../../components/RebutPosisiModal';
import { PayKitaQRISModal } from '../../../components/PayKitaQRISModal';
import {
  MgcExternalLink,
  MgcTelegram,
  MgcCheckCircle,
  MgcArrowRight,
  MgcLoading,
} from '../../../components/MingCuteIcons';
import { orderErrorMessage } from '../../../lib/orderErrors';
import { Bot, BotCategory, CATEGORY_LABELS } from '../../../types';

function ClickTracker({ botId }: { botId: string }) {
  useEffect(() => {
    void fetch('/api/bots/click', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ botId, kind: 'detail' }),
    });
  }, [botId]);
  return null;
}

export default function BotDetailPage() {
  const router = useRouter();
  const routeParams = useParams();
  const rawUsername = typeof routeParams?.username === 'string' ? routeParams.username : '';

  const [bot, setBot] = useState<Bot | null>(null);
  const [rank, setRank] = useState<number>(1);
  const [allBots, setAllBots] = useState<Bot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFoundFlag, setNotFoundFlag] = useState(false);

  const [rebutModalOpen, setRebutModalOpen] = useState(false);
  const [isQRISModalOpen, setIsQRISModalOpen] = useState(false);
  const [pendingOrder, setPendingOrder] = useState<{
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
  } | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (!rawUsername) {
      setNotFoundFlag(true);
      setIsLoading(false);
      return;
    }

    const run = async () => {
      const res = await fetch(`/api/bots?limit=100`);
      if (!res.ok) {
        if (!cancelled) setNotFoundFlag(true);
        return;
      }
      const result = await res.json();
      const bots: Bot[] = result.data ?? [];

      const sorted = [...bots].sort((a, b) => {
        const diff = (b.total_bid_amount || 0) - (a.total_bid_amount || 0);
        if (diff !== 0) return diff;
        if (a.rank && b.rank) return a.rank - b.rank;
        return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
      });

      const found = sorted.find(
        (b) => b.telegram_username.toLowerCase() === decodeURIComponent(rawUsername).toLowerCase()
      );

      if (!cancelled) {
        if (!found) {
          setNotFoundFlag(true);
        } else {
          const r = sorted.findIndex((b) => b.id === found.id) + 1;
          setBot(found);
          setRank(r);
          setAllBots(sorted);
        }
        setIsLoading(false);
      }
    };

    run().catch(() => {
      if (!cancelled) {
        setNotFoundFlag(true);
        setIsLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [rawUsername]);

  const handleProceedRebutPayment = async (data: {
    challengerUsername: string;
    challengerBotName: string;
    challengerDescription: string;
    challengerCategory: BotCategory;
    amount: number;
    targetBot: Bot;
    avatarUrl?: string;
  }) => {
    const existing = allBots.find(
      (b) => b.telegram_username.toLowerCase() === data.challengerUsername.toLowerCase()
    );

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          telegramUsername: data.challengerUsername,
          botName: data.challengerBotName,
          description: data.challengerDescription,
          category: data.challengerCategory,
          amount: data.amount,
          avatarUrl: data.avatarUrl,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'ORDER_FAILED');

      setPendingOrder({
        orderId: result.data.public_id,
        botName: data.challengerBotName || existing?.bot_name || data.challengerUsername,
        telegramUsername: data.challengerUsername,
        category: data.challengerCategory,
        amount: result.data.amount,
        payAmount: result.data.pay_amount,
        qrisString: result.data.qris,
        expiresAt: result.data.expires_at,
        checkoutUrl: result.data.checkout_url,
        sandbox: result.data.sandbox,
      });
      setRebutModalOpen(false);
      setIsQRISModalOpen(true);
    } catch (err) {
      return orderErrorMessage(err);
    }
  };

  const handlePaymentSuccess = async () => {
    const res = await fetch('/api/bots?limit=100').catch(() => null);
    if (!res?.ok || !bot) return;
    const result = await res.json();
    const bots: Bot[] = result.data ?? [];
    const sorted = [...bots].sort((a, b) => {
      const diff = (b.total_bid_amount || 0) - (a.total_bid_amount || 0);
      if (diff !== 0) return diff;
      if (a.rank && b.rank) return a.rank - b.rank;
      return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
    });
    const refreshed = sorted.find((b) => b.id === bot.id);
    if (refreshed) {
      setBot(refreshed);
      setRank(sorted.findIndex((b) => b.id === refreshed.id) + 1);
      setAllBots(sorted);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f0f2f5]">
        <Header />
        <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-8 space-y-4">
          <div className="rounded-2xl bg-white border border-[#e4ecf2] p-6 animate-pulse space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-200 shrink-0" />
              <div className="flex-1 space-y-2 pt-1">
                <div className="h-5 bg-slate-200 rounded w-1/2" />
                <div className="h-3 bg-slate-100 rounded w-1/4" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((i) => <div key={i} className="h-16 rounded-xl bg-slate-100" />)}
            </div>
            <div className="h-20 rounded-xl bg-slate-100" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (notFoundFlag || !bot) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f0f2f5]">
        <Header />
        <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#eef5fc] text-[#3390ec] flex items-center justify-center mx-auto text-xl font-black">
            404
          </div>
          <h1 className="text-xl font-black text-[#1c242b]">Bot tidak ditemukan</h1>
          <p className="text-sm text-[#707579]">Username bot tidak terdaftar di TeleRank.</p>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#3390ec] text-white font-bold text-xs hover:bg-[#2481cc] transition-colors"
          >
            <span>Kembali ke Leaderboard</span>
            <MgcArrowRight size={14} />
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const categoryName = CATEGORY_LABELS[bot.category] || bot.category;
  const botSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://telerank.com';

  const botJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Leaderboard',
            item: botSiteUrl,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: `@${bot.telegram_username}`,
            item: `${botSiteUrl}/bot/${encodeURIComponent(bot.telegram_username.toLowerCase())}`,
          },
        ],
      },
      {
        '@type': 'SoftwareApplication',
        name: bot.bot_name,
        operatingSystem: 'Telegram',
        applicationCategory: categoryName,
        description: bot.description || `Bot Telegram ${bot.bot_name} (@${bot.telegram_username}) di TeleRank`,
        url: `https://t.me/${bot.telegram_username}`,
        image: bot.avatar_url,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'IDR',
        },
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f0f2f5]">
      <ClickTracker botId={bot.id} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(botJsonLd) }}
      />
      <Header />

      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-8 space-y-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-[#707579]">
          <Link href="/" className="hover:text-[#3390ec] transition-colors font-semibold">
            Leaderboard
          </Link>
          <MgcArrowRight size={12} />
          <span className="text-[#1c242b] font-semibold truncate">@{bot.telegram_username}</span>
        </div>

        {/* Main Detail Card */}
        <div className="rounded-2xl bg-white border border-[#e4ecf2] p-5 sm:p-7 shadow-xs space-y-4">
          {/* Header: Avatar + Name + Close/Back */}
          <div className="flex items-start justify-between gap-3 pb-3.5 border-b border-[#e4ecf2]">
            <div className="flex items-start gap-3 min-w-0 flex-1">
              <div className="relative shrink-0">
                <img
                  src={bot.avatar_url}
                  alt={bot.bot_name}
                  className="w-12 h-12 rounded-2xl object-cover border border-[#e4ecf2]"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#4cd964] border-2 border-white" />
              </div>

              <div className="min-w-0 flex-1">
                <h1 className="text-sm sm:text-base font-black text-[#1c242b] leading-snug flex items-center gap-1.5 flex-wrap">
                  <span>{bot.bot_name}</span>
                  {bot.is_verified && (
                    <span className="inline-flex items-center text-[#3390ec] shrink-0" title="Bot Terverifikasi">
                      <MgcCheckCircle size={16} />
                    </span>
                  )}
                </h1>
                <p className="text-xs font-mono text-[#3390ec] font-bold pt-0.5">
                  @{bot.telegram_username}
                </p>
              </div>
            </div>

            <Link
              href="/"
              className="p-1.5 rounded-xl text-[#707579] hover:text-[#1c242b] hover:bg-[#f4f7fa] transition-all shrink-0 ml-1 text-xs font-semibold"
            >
              ← Kembali
            </Link>
          </div>

          {/* Stats Strip */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2.5 rounded-xl bg-[#f4f7fa] border border-[#e4ecf2]">
              <span className="block text-[10px] text-[#707579] uppercase font-bold">Peringkat</span>
              <span className="font-mono text-lg font-black text-[#3390ec]">#{rank}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#f4f7fa] border border-[#e4ecf2]">
              <span className="block text-[10px] text-[#707579] uppercase font-bold">Total Sponsor</span>
              <span className="font-mono text-sm sm:text-base font-black text-[#1c242b]">
                Rp{bot.total_bid_amount.toLocaleString('id-ID')}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#f4f7fa] border border-[#e4ecf2]">
              <span className="block text-[10px] text-[#707579] uppercase font-bold">Total Klik</span>
              <span className="font-mono text-lg font-black text-[#1c242b]">{bot.daily_clicks}</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-[#1c242b] uppercase tracking-wider">Deskripsi Bot</h2>
              <span className="px-2 py-0.5 rounded-md bg-[#eef5fc] text-[#3390ec] text-[10px] font-bold">
                {categoryName}
              </span>
            </div>
            <p className="text-xs text-[#707579] leading-relaxed bg-[#f4f7fa] p-3 rounded-xl border border-[#e4ecf2]">
              {bot.description || 'Tidak ada deskripsi.'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
            <a
              href={`https://t.me/${bot.telegram_username}?start=telerank`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-[#3390ec] hover:bg-[#2481cc] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <MgcTelegram size={16} />
              <span>Buka Bot di Telegram</span>
              <MgcExternalLink size={14} />
            </a>

            <button
              type="button"
              onClick={() => setRebutModalOpen(true)}
              className="w-full sm:w-auto py-2.5 px-5 rounded-xl bg-[#f4f7fa] hover:bg-[#eef5fc] border border-[#d2e5f8] text-[#3390ec] font-bold text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors"
            >
              <span>Rebut Posisi #{rank}</span>
            </button>
          </div>
        </div>
      </main>

      <Footer />

      <RebutPosisiModal
        isOpen={rebutModalOpen}
        onClose={() => setRebutModalOpen(false)}
        targetBot={bot}
        targetRank={rank}
        currentBots={allBots}
        onProceedPayment={handleProceedRebutPayment}
      />

      {pendingOrder && (
        <PayKitaQRISModal
          isOpen={isQRISModalOpen}
          onClose={() => setIsQRISModalOpen(false)}
          orderData={pendingOrder}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
