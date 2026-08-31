'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from '../components/Header';
import { HeroPodiumCard } from '../components/HeroPodiumCard';
import { HeroListingBar } from '../components/HeroListingBar';
import { BotCard } from '../components/BotCard';
import { RecentActivitySection } from '../components/RecentActivitySection';
import { RebutPosisiModal } from '../components/RebutPosisiModal';
import { PromosikanBotModal } from '../components/PromosikanBotModal';
import { BotDetailModal } from '../components/BotDetailModal';
import { PayKitaQRISModal } from '../components/PayKitaQRISModal';
import { Footer } from '../components/Footer';
import { getStoredBots, saveStoredBots, getStoredNotifications, saveStoredNotifications } from '../lib/storage';
import { orderErrorMessage } from '../lib/orderErrors';
import { Bot, BotCategory, OutbidNotification, BOT_CATEGORIES } from '../types';
import { MgcTrophy, MgcTime, MgcCalendar, MgcBot } from '../components/MingCuteIcons';

const CATEGORIES: { id: BotCategory; label: string }[] = [
  { id: 'ALL', label: 'Semua' },
  ...BOT_CATEGORIES,
];

export default function Home() {
  const [bots, setBots] = useState<Bot[]>([]);
  const [totalBotsCount, setTotalBotsCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [notifications, setNotifications] = useState<OutbidNotification[]>([]);
  const [activeCategory, setActiveCategory] = useState<BotCategory>('ALL');
  const [timeFilter, setTimeFilter] = useState<'ALL' | 'TODAY'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Load backend data upon mount
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    fetch('/api/bots?limit=100')
      .then(async (response) => {
        if (!response.ok) throw new Error('BACKEND_UNAVAILABLE');
        const result = await response.json();
        if (!cancelled && result.data) {
          const fresh = result.data;
          setBots(fresh);
          setTotalBotsCount(result.total ?? fresh.length);
          saveStoredBots(fresh);
        }
      })
      .catch((err) => {
        console.error('Failed to load bots from backend', err);
        if (!cancelled) {
          const cached = getStoredBots();
          setBots(cached);
          setTotalBotsCount(cached.length);
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    fetch('/api/activity')
      .then(async (response) => {
        if (!response.ok) throw new Error('BACKEND_UNAVAILABLE');
        const result = await response.json();
        if (!cancelled && result.data) {
          setNotifications(result.data);
          saveStoredNotifications(result.data);
        }
      })
      .catch((err) => {
        console.error('Failed to load activity from backend', err);
        if (!cancelled) setNotifications(getStoredNotifications());
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleLoadMore = async () => {
    if (isLoadingMore || bots.length >= totalBotsCount) return;
    setIsLoadingMore(true);
    try {
      const response = await fetch(`/api/bots?limit=100&offset=${bots.length}`);
      if (!response.ok) throw new Error('BACKEND_UNAVAILABLE');
      const result = await response.json();
      if (result.data?.length) {
        setBots((prev) => [...prev, ...result.data]);
        setTotalBotsCount(result.total ?? bots.length + result.data.length);
      }
    } catch (error) {
      console.error('Failed to load more bots', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Save to storage whenever bots or notifications change
  const updateBots = (newBots: Bot[]) => {
    setBots(newBots);
    saveStoredBots(newBots);
  };

  // Modals
  const [rebutModalOpen, setRebutModalOpen] = useState(false);
  const [selectedBotForRebut, setSelectedBotForRebut] = useState<Bot | null>(null);
  const [rebutTargetRank, setRebutTargetRank] = useState<number>(1);

  const [promoteModalOpen, setPromoteModalOpen] = useState(false);
  const [promoteInitialData, setPromoteInitialData] = useState<{
    username: string;
    category: BotCategory;
    amount: number;
  }>({
    username: '',
    category: 'DOWNLOADER',
    amount: 50000,
  });

  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedBotForDetail, setSelectedBotForDetail] = useState<Bot | null>(null);
  const [detailRank, setDetailRank] = useState<number>(1);

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
    oldRank?: number;
  } | null>(null);

  // Sort bots: PURELY AND STRICTLY DETERMINED BY SPONSOR VALUE (total_bid_amount DESCENDING).
  // Clicks do NOT affect rank. If amount is tied, first-come first-served (registration time).
  const sortedBots = useMemo(() => {
    return [...bots].sort((a, b) => {
      // 1. Primary & Absolute determinant: Total Sponsor Amount (Descending)
      const amountDiff = (b.total_bid_amount || 0) - (a.total_bid_amount || 0);
      if (amountDiff !== 0) return amountDiff;

      // 2. Stable fallback tie-breaker: Database rank / registration time
      if (a.rank && b.rank) return a.rank - b.rank;
      return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
    });
  }, [bots]);

  // Filter bots by time ('ALL' vs 'TODAY'), category, and search
  const filteredBots = useMemo(() => {
    const now = new Date();
    const isToday = (dateStr?: string) => {
      if (!dateStr) return false;
      const d = new Date(dateStr);
      const diffHours = (now.getTime() - d.getTime()) / (1000 * 60 * 60);
      return d.toDateString() === now.toDateString() || (diffHours >= 0 && diffHours <= 24);
    };

    return sortedBots.filter((bot) => {
      // 1. Time Filter: 'TODAY' only displays bots with sponsor/listing activity today or past 24 hours
      if (timeFilter === 'TODAY') {
        const activeToday = isToday(bot.sponsor_updated_at) || isToday(bot.created_at);
        if (!activeToday) return false;
      }

      // 2. Category Filter
      const matchCategory = activeCategory === 'ALL' || bot.category === activeCategory;

      // 3. Search Filter
      const matchSearch =
        bot.bot_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bot.telegram_username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bot.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCategory && matchSearch;
    });
  }, [sortedBots, timeFilter, activeCategory, searchQuery]);

  // Split bots: Top 3, 4-10, Rest
  const top3Bots = filteredBots.slice(0, 3);
  const rank4to10Bots = filteredBots.slice(3, 10);
  const restBots = filteredBots.slice(10);

  // Increment clicks when user interacts with a bot
  const handleIncrementClick = (botId: string) => {
    setBots((prev) =>
      prev.map((b) =>
        b.id === botId ? { ...b, daily_clicks: (b.daily_clicks || 0) + 1 } : b
      )
    );
    void fetch('/api/bots/click', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ botId, kind: 'detail' }),
    });
  };

  // Handlers
  const handleOpenRebut = (bot: Bot) => {
    const rank = sortedBots.findIndex((b) => b.id === bot.id) + 1;
    setSelectedBotForRebut(bot);
    setRebutTargetRank(rank);
    setRebutModalOpen(true);
  };

  const handleOpenDetail = (bot: Bot) => {
    const rank = sortedBots.findIndex((b) => b.id === bot.id) + 1;
    handleIncrementClick(bot.id);
    setSelectedBotForDetail(bot);
    setDetailRank(rank);
    setDetailModalOpen(true);
  };

  // When user clicks "Promosikan" on the fast submit bar, open PromosikanBotModal
  const handleFastSubmitBar = (botUsername: string, category: BotCategory, amount: number) => {
    setPromoteInitialData({
      username: botUsername,
      category,
      amount,
    });
    setPromoteModalOpen(true);
  };

  const handleProceedPromotePayment = async (data: {
    username: string;
    botName: string;
    category: BotCategory;
    description: string;
    amount: number;
    avatarUrl?: string;
  }) => {
    const existing = bots.find(
      (b) => b.telegram_username.toLowerCase() === data.username.toLowerCase()
    );
    const oldRank = existing
      ? sortedBots.findIndex((b) => b.id === existing.id) + 1
      : sortedBots.length + 1;

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          telegramUsername: data.username,
          botName: data.botName,
          description: data.description,
          category: data.category,
          amount: data.amount,
          avatarUrl: data.avatarUrl,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'ORDER_FAILED');

      setPendingOrder({
        orderId: result.data.public_id,
        botName: data.botName || existing?.bot_name || data.username,
        telegramUsername: data.username,
        category: data.category,
        amount: result.data.amount,
        payAmount: result.data.pay_amount,
        qrisString: result.data.qris,
        expiresAt: result.data.expires_at,
        checkoutUrl: result.data.checkout_url,
        sandbox: result.data.sandbox,
        oldRank,
      });
      setPromoteModalOpen(false);
      setIsQRISModalOpen(true);
    } catch (err) {
      return orderErrorMessage(err);
    }
  };

  const handleProceedRebutPayment = async (data: {
    challengerUsername: string;
    challengerBotName: string;
    challengerDescription: string;
    challengerCategory: BotCategory;
    amount: number;
    targetBot: Bot;
    avatarUrl?: string;
  }) => {
    const existing = bots.find(
      (b) => b.telegram_username.toLowerCase() === data.challengerUsername.toLowerCase()
    );
    const oldRank = existing
      ? sortedBots.findIndex((b) => b.id === existing.id) + 1
      : sortedBots.length + 1;

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
        oldRank,
      });
      setRebutModalOpen(false);
      setIsQRISModalOpen(true);
    } catch (err) {
      return orderErrorMessage(err);
    }
  };

  const handlePaymentSuccess = async () => {
    if (!pendingOrder) return;

    try {
      const [botsResponse, activityResponse] = await Promise.all([
        fetch('/api/bots?limit=100'),
        fetch('/api/activity'),
      ]);
      if (!botsResponse.ok) throw new Error('BACKEND_UNAVAILABLE');
      const botsResult = await botsResponse.json();
      const freshBots: Bot[] = botsResult.data ?? [];
      setBots(freshBots);
      saveStoredBots(freshBots);

      if (activityResponse.ok) {
        const activityResult = await activityResponse.json();
        if (activityResult.data) {
          setNotifications(activityResult.data);
          saveStoredNotifications(activityResult.data);
        }
      }
    } catch (error) {
      console.error('Failed to refresh bots after payment', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f0f2f5]">
      {/* 1. Header Navbar */}
      <Header />

      {/* 2. Main Content Container */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-4 space-y-4">
        {/* 3D Podium Header Card with Smooth Celebration Micro-Interaction */}
        {activeCategory === 'ALL' && (
          <HeroPodiumCard
            topBots={top3Bots}
            onOpenSubmit={() => {
              setPromoteInitialData({
                username: '',
                category: 'DOWNLOADER',
                amount: sortedBots[0]?.total_bid_amount + 1 || 50000,
              });
              setPromoteModalOpen(true);
            }}
            onSelectBot={handleOpenRebut}
          />
        )}

        {/* Dynamic Stepper & 1-Row Fast Submit Bar */}
        <HeroListingBar
          currentBots={sortedBots}
          onSubmit={handleFastSubmitBar}
        />

        {/* Live Counters & Filters */}
        <div className="text-center space-y-3 pt-1">
          {/* Live Status Indicators */}
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#707579]">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#4cd964] animate-tg-pulse" />
              <span>12 online</span>
            </span>
            <span>•</span>
            <span>4.820 pengunjung</span>
            <span>•</span>
            <button
              onClick={() => {
                setPromoteInitialData({
                  username: '',
                  category: 'DOWNLOADER',
                  amount: sortedBots[0]?.total_bid_amount + 1 || 50000,
                });
                setPromoteModalOpen(true);
              }}
              className="text-[#3390ec] hover:text-[#2481cc] font-bold flex items-center gap-1 cursor-pointer"
            >
              <MgcTrophy size={14} className="text-amber-500" />
              <span>Klaim Posisi #1</span>
            </button>
          </div>

          {/* Filter Pills (Keseluruhan / Hari ini) */}
          <div className="flex items-center justify-center gap-1.5">
            <button
              onClick={() => setTimeFilter('ALL')}
              className={`px-3.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                timeFilter === 'ALL'
                  ? 'bg-[#3390ec] text-white shadow-xs'
                  : 'bg-white text-[#707579] hover:bg-[#eef5fc] hover:text-[#3390ec] border border-[#e4ecf2]'
              }`}
            >
              <MgcTime size={13} />
              <span>Keseluruhan</span>
            </button>
            <button
              onClick={() => setTimeFilter('TODAY')}
              className={`px-3.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                timeFilter === 'TODAY'
                  ? 'bg-[#3390ec] text-white shadow-xs'
                  : 'bg-white text-[#707579] hover:bg-[#eef5fc] hover:text-[#3390ec] border border-[#e4ecf2]'
              }`}
            >
              <MgcCalendar size={13} />
              <span>Hari ini</span>
            </button>
          </div>

          {/* Category Pills */}
          <div className="flex items-center justify-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#3390ec] text-white shadow-xs'
                      : 'bg-white text-[#707579] hover:bg-[#eef5fc] hover:text-[#3390ec] border border-[#e4ecf2]'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Telegram Bot Cards Section */}
        <div className="space-y-3 pt-1">
          {/* Loading Skeleton */}
          {isLoading && bots.length === 0 && (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-white border border-[#e4ecf2] p-4 sm:p-5 shadow-xs flex items-center gap-3 sm:gap-4 animate-pulse"
                >
                  <div className="w-8 h-8 rounded-xl bg-slate-200 shrink-0" />
                  <div className="w-12 h-12 rounded-2xl bg-slate-200 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-1/3" />
                    <div className="h-3 bg-slate-100 rounded w-2/3" />
                  </div>
                  <div className="w-24 h-8 bg-slate-200 rounded-xl shrink-0" />
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && filteredBots.length === 0 && (
            <div className="text-center py-12 px-4 rounded-2xl bg-white border border-[#e4ecf2] shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#eef5fc] text-[#3390ec] flex items-center justify-center mx-auto text-xl font-bold">
                <MgcBot size={26} />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-[#1c242b]">
                {searchQuery || activeCategory !== 'ALL'
                  ? 'Tidak ada bot yang sesuai filter'
                  : 'Belum ada bot terdaftar'}
              </h3>
              <p className="text-xs text-[#707579] max-w-sm mx-auto">
                {searchQuery || activeCategory !== 'ALL'
                  ? 'Coba gunakan kata kunci pencarian lain atau pilih kategori Semua.'
                  : 'Daftarkan bot Telegram kamu sekarang untuk langsung menempati posisi #1 teratas!'}
              </p>
              {!searchQuery && activeCategory === 'ALL' && (
                <button
                  onClick={() => {
                    setPromoteInitialData({
                      username: '',
                      category: 'DOWNLOADER',
                      amount: 50000,
                    });
                    setPromoteModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#3390ec] text-white font-bold text-xs hover:bg-[#2481cc] transition-colors cursor-pointer shadow-xs"
                >
                  + Daftarkan Bot Pertama
                </button>
              )}
            </div>
          )}

          {/* Top 1, 2, 3 Cards */}
          {top3Bots.map((bot, index) => (
            <BotCard
              key={bot.id}
              rank={index + 1}
              bot={bot}
              onRebut={handleOpenRebut}
              onDetail={handleOpenDetail}
            />
          ))}

          {/* Aktivitas Terbaru Section */}
          {notifications.length > 0 && (
            <RecentActivitySection notifications={notifications} bots={bots} />
          )}

          {/* Cards #4 to #10 */}
          {rank4to10Bots.map((bot, index) => (
            <BotCard
              key={bot.id}
              rank={index + 4}
              bot={bot}
              onRebut={handleOpenRebut}
              onDetail={handleOpenDetail}
            />
          ))}

          {/* TOP 10 Divider Pill */}
          {restBots.length > 0 && (
            <div className="py-2 flex items-center justify-center">
              <span className="px-3.5 py-1 rounded-lg bg-white border border-[#e4ecf2] text-[#707579] font-mono font-bold text-[10px] tracking-wider uppercase shadow-2xs">
                TOP 10
              </span>
            </div>
          )}

          {/* Cards #11 to #20 */}
          {restBots.map((bot, index) => (
            <BotCard
              key={bot.id}
              rank={index + 11}
              bot={bot}
              onRebut={handleOpenRebut}
              onDetail={handleOpenDetail}
            />
          ))}
        </div>

        {/* Show More Button */}
        {bots.length < totalBotsCount && (
          <div className="pt-3 text-center">
            <button
              type="button"
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="w-full py-3 rounded-2xl bg-white hover:bg-[#eef5fc] border border-[#e4ecf2] text-[#3390ec] font-bold text-xs sm:text-sm shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {isLoadingMore ? 'Memuat...' : `Tampilkan ${totalBotsCount - bots.length} bot lainnya`}
            </button>
          </div>
        )}
      </main>

      {/* 4. Telegram Footer */}
      <Footer />

      {/* Modal 1: Promosikan Bot Baru (From Fast Listing Bar) */}
      <PromosikanBotModal
        isOpen={promoteModalOpen}
        onClose={() => setPromoteModalOpen(false)}
        initialUsername={promoteInitialData.username}
        initialCategory={promoteInitialData.category}
        initialAmount={promoteInitialData.amount}
        currentBots={sortedBots}
        onProceedPayment={handleProceedPromotePayment}
      />

      {/* Modal 2: Rebut Posisi Bot Tertentu */}
      <RebutPosisiModal
        isOpen={rebutModalOpen}
        onClose={() => setRebutModalOpen(false)}
        targetBot={selectedBotForRebut}
        targetRank={rebutTargetRank}
        onProceedPayment={handleProceedRebutPayment}
      />

      {/* Modal 3: Detail Statistik Bot */}
      <BotDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        bot={selectedBotForDetail}
        rank={detailRank}
        onRebut={handleOpenRebut}
      />

      {/* Modal 4: Pembayaran QRIS Instan */}
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
