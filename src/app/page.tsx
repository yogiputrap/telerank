'use client';

import React, { useState, useEffect } from 'react';
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
import { INITIAL_BOTS, INITIAL_NOTIFICATIONS } from '../lib/mockData';
import { getStoredBots, saveStoredBots, getStoredNotifications, saveStoredNotifications } from '../lib/storage';
import { orderErrorMessage } from '../lib/orderErrors';
import { Bot, BotCategory, OutbidNotification, BOT_CATEGORIES } from '../types';

const CATEGORIES: { id: BotCategory; label: string }[] = [
  { id: 'ALL', label: 'Semua' },
  ...BOT_CATEGORIES,
];

export default function Home() {
  const [bots, setBots] = useState<Bot[]>(INITIAL_BOTS);
  const [totalBotsCount, setTotalBotsCount] = useState<number>(INITIAL_BOTS.length);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [notifications, setNotifications] = useState<OutbidNotification[]>(INITIAL_NOTIFICATIONS);
  const [activeCategory, setActiveCategory] = useState<BotCategory>('ALL');
  const [timeFilter, setTimeFilter] = useState<'ALL' | 'TODAY'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Load backend data upon mount; local storage remains a development fallback.
  useEffect(() => {
    let cancelled = false;
    fetch('/api/bots?limit=100')
      .then(async (response) => {
        if (!response.ok) throw new Error('BACKEND_UNAVAILABLE');
        const result = await response.json();
        if (!cancelled && result.data?.length) {
          setBots(result.data);
          setTotalBotsCount(result.total ?? result.data.length);
        }
      })
      .catch(() => {
        if (!cancelled) setBots(getStoredBots());
      });
    fetch('/api/activity')
      .then(async (response) => {
        if (!response.ok) throw new Error('BACKEND_UNAVAILABLE');
        const result = await response.json();
        if (!cancelled && result.data) setNotifications(result.data);
      })
      .catch(() => {
        if (!cancelled) setNotifications(getStoredNotifications());
      });
    return () => { cancelled = true; };
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

  // Sort bots descending by bid amount (or by daily clicks if timeFilter is TODAY)
  const sortedBots = [...bots].sort((a, b) => {
    if (timeFilter === 'TODAY') {
      // In TODAY mode, sort by combined momentum (daily clicks + bid weight)
      const weightA = a.total_bid_amount + a.daily_clicks * 5000;
      const weightB = b.total_bid_amount + b.daily_clicks * 5000;
      return weightB - weightA;
    }
    return b.total_bid_amount - a.total_bid_amount;
  });

  // Filter bots by category and search
  const filteredBots = sortedBots.filter((bot) => {
    const matchCategory = activeCategory === 'ALL' || bot.category === activeCategory;
    const matchSearch =
      bot.bot_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bot.telegram_username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bot.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  // Split bots: Top 3, 4-10, Rest
  const top3Bots = filteredBots.slice(0, 3);
  const rank4to10Bots = filteredBots.slice(3, 10);
  const restBots = filteredBots.slice(10);

  // Increment clicks when user interacts with a bot
  const handleIncrementClick = (botId: string) => {
    const updated = bots.map((b) =>
      b.id === botId ? { ...b, daily_clicks: b.daily_clicks + 1 } : b
    );
    void fetch('/api/bots/click', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ botId, kind: 'detail' }) });
    updateBots(updated);
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
              className="text-[#3390ec] hover:text-[#2481cc] font-bold flex items-center gap-0.5 cursor-pointer"
            >
              <span>🏆 Klaim Posisi #1</span>
            </button>
          </div>

          {/* Filter Pills (Keseluruhan / Hari ini) */}
          <div className="flex items-center justify-center gap-1.5">
            <button
              onClick={() => setTimeFilter('ALL')}
              className={`px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                timeFilter === 'ALL'
                  ? 'bg-[#3390ec] text-white shadow-xs'
                  : 'bg-white text-[#707579] hover:bg-[#eef5fc] hover:text-[#3390ec] border border-[#e4ecf2]'
              }`}
            >
              ⏳ Keseluruhan
            </button>
            <button
              onClick={() => setTimeFilter('TODAY')}
              className={`px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                timeFilter === 'TODAY'
                  ? 'bg-[#3390ec] text-white shadow-xs'
                  : 'bg-white text-[#707579] hover:bg-[#eef5fc] hover:text-[#3390ec] border border-[#e4ecf2]'
              }`}
            >
              📅 Hari ini
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
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
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
          <RecentActivitySection notifications={notifications} />

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
              <span className="px-3.5 py-1 rounded-full bg-white border border-[#e4ecf2] text-[#707579] font-mono font-bold text-[10px] tracking-wider uppercase shadow-2xs">
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
