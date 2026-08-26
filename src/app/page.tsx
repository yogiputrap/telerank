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
import { Bot, BotCategory, OutbidNotification, BOT_CATEGORIES } from '../types';

const CATEGORIES: { id: BotCategory; label: string }[] = [
  { id: 'ALL', label: 'Semua' },
  ...BOT_CATEGORIES,
];

export default function Home() {
  const [bots, setBots] = useState<Bot[]>(INITIAL_BOTS);
  const [notifications, setNotifications] = useState<OutbidNotification[]>(INITIAL_NOTIFICATIONS);
  const [activeCategory, setActiveCategory] = useState<BotCategory>('ALL');
  const [timeFilter, setTimeFilter] = useState<'ALL' | 'TODAY'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Load from storage upon mount for persistence
  useEffect(() => {
    setBots(getStoredBots());
    setNotifications(getStoredNotifications());
  }, []);

  // Save to storage whenever bots or notifications change
  const updateBots = (newBots: Bot[]) => {
    setBots(newBots);
    saveStoredBots(newBots);
  };

  const updateNotifications = (newNotifs: OutbidNotification[]) => {
    setNotifications(newNotifs);
    saveStoredNotifications(newNotifs);
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
    amount: number;
    payAmount: number;
    qrisString: string;
    targetBotData?: Partial<Bot>;
    isTopUp?: boolean;
    existingBotId?: string;
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

  const handleProceedPromotePayment = (data: {
    username: string;
    botName: string;
    category: BotCategory;
    description: string;
    amount: number;
  }) => {
    const orderId = `TR-${Math.floor(100000 + Math.random() * 900000)}`;
    const existing = bots.find(
      (b) => b.telegram_username.toLowerCase() === data.username.toLowerCase()
    );

    if (existing) {
      setPendingOrder({
        orderId,
        botName: data.botName || existing.bot_name,
        telegramUsername: data.username,
        amount: data.amount,
        payAmount: data.amount,
        qrisString: `00020101021226590014ID.LINKAJA.WWW01189360091438202812080215081234567890520458125303360540${data.amount}5802ID5910TELERANK_ID6007JAKARTA62070703A016304E8A9`,
        isTopUp: true,
        existingBotId: existing.id,
        targetBotData: {
          bot_name: data.botName,
          category: data.category,
          description: data.description,
        },
      });
    } else {
      const newBotData: Partial<Bot> = {
        telegram_username: data.username,
        bot_name: data.botName || `@${data.username}`,
        avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${data.username}`,
        description: data.description || `Bot Telegram resmi @${data.username} di TeleRank.`,
        category: data.category,
        custom_tagline: 'Bot baru terverifikasi di TeleRank',
        contact_handle: '08123456789',
        is_verified: false,
        is_online: true,
        daily_clicks: 1,
      };

      setPendingOrder({
        orderId,
        botName: newBotData.bot_name || data.username,
        telegramUsername: data.username,
        amount: data.amount,
        payAmount: data.amount,
        qrisString: `00020101021226590014ID.LINKAJA.WWW01189360091438202812080215081234567890520458125303360540${data.amount}5802ID5910TELERANK_ID6007JAKARTA62070703A016304E8A9`,
        targetBotData: newBotData,
        isTopUp: false,
      });
    }

    setPromoteModalOpen(false);
    setIsQRISModalOpen(true);
  };

  const handleProceedRebutPayment = (data: {
    challengerUsername: string;
    challengerBotName: string;
    challengerDescription: string;
    challengerCategory: BotCategory;
    amount: number;
    targetBot: Bot;
  }) => {
    const orderId = `TR-${Math.floor(100000 + Math.random() * 900000)}`;
    const existing = bots.find(
      (b) => b.telegram_username.toLowerCase() === data.challengerUsername.toLowerCase()
    );

    if (existing) {
      setPendingOrder({
        orderId,
        botName: data.challengerBotName || existing.bot_name,
        telegramUsername: data.challengerUsername,
        amount: data.amount,
        payAmount: data.amount,
        qrisString: `00020101021226590014ID.LINKAJA.WWW01189360091438202812080215081234567890520458125303360540${data.amount}5802ID5910TELERANK_ID6007JAKARTA62070703A016304E8A9`,
        isTopUp: true,
        existingBotId: existing.id,
        targetBotData: {
          bot_name: data.challengerBotName,
          category: data.challengerCategory,
          description: data.challengerDescription,
        },
      });
    } else {
      const newBotData: Partial<Bot> = {
        telegram_username: data.challengerUsername,
        bot_name: data.challengerBotName || `@${data.challengerUsername}`,
        avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${data.challengerUsername}`,
        description: data.challengerDescription || `Bot Telegram resmi @${data.challengerUsername} di TeleRank.`,
        category: data.challengerCategory,
        custom_tagline: 'Bot baru pemenang lelang posisi',
        contact_handle: '08123456789',
        is_verified: false,
        is_online: true,
        daily_clicks: 1,
      };

      setPendingOrder({
        orderId,
        botName: newBotData.bot_name || data.challengerUsername,
        telegramUsername: data.challengerUsername,
        amount: data.amount,
        payAmount: data.amount,
        qrisString: `00020101021226590014ID.LINKAJA.WWW01189360091438202812080215081234567890520458125303360540${data.amount}5802ID5910TELERANK_ID6007JAKARTA62070703A016304E8A9`,
        targetBotData: newBotData,
        isTopUp: false,
      });
    }

    setRebutModalOpen(false);
    setIsQRISModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    if (!pendingOrder) return;

    let updatedBots: Bot[] = [];
    let oldRank = 99;
    let newRank = 1;

    if (pendingOrder.isTopUp && pendingOrder.existingBotId) {
      // Find old rank
      const prevIdx = sortedBots.findIndex((b) => b.id === pendingOrder.existingBotId);
      if (prevIdx !== -1) oldRank = prevIdx + 1;

      updatedBots = bots.map((b) =>
        b.id === pendingOrder.existingBotId
          ? {
              ...b,
              bot_name: pendingOrder.targetBotData?.bot_name || pendingOrder.botName || b.bot_name,
              description: pendingOrder.targetBotData?.description || b.description,
              category: pendingOrder.targetBotData?.category || b.category,
              total_bid_amount: pendingOrder.amount,
            }
          : b
      );
    } else if (pendingOrder.targetBotData) {
      const newBot: Bot = {
        id: `bot-${Date.now()}`,
        telegram_username: pendingOrder.targetBotData.telegram_username || 'new_bot',
        bot_name: pendingOrder.targetBotData.bot_name || 'New Bot',
        avatar_url: pendingOrder.targetBotData.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${pendingOrder.telegramUsername}`,
        description: pendingOrder.targetBotData.description || 'Bot baru di TeleRank',
        category: pendingOrder.targetBotData.category || 'DOWNLOADER',
        custom_tagline: pendingOrder.targetBotData.custom_tagline || '',
        total_bid_amount: pendingOrder.amount,
        contact_handle: pendingOrder.targetBotData.contact_handle || '',
        is_verified: false,
        is_online: true,
        daily_clicks: 1,
        created_at: new Date().toISOString(),
      };

      updatedBots = [newBot, ...bots];
    }

    // Recalculate true dynamic new rank
    const newSorted = [...updatedBots].sort((a, b) => b.total_bid_amount - a.total_bid_amount);
    const targetUsername = pendingOrder.telegramUsername.toLowerCase();
    const computedIdx = newSorted.findIndex(
      (b) => b.telegram_username.toLowerCase() === targetUsername
    );
    if (computedIdx !== -1) newRank = computedIdx + 1;

    updateBots(updatedBots);

    const newNotif: OutbidNotification = {
      id: `notif-${Date.now()}`,
      bot_name: pendingOrder.botName,
      telegram_username: pendingOrder.telegramUsername,
      old_rank: oldRank,
      new_rank: newRank,
      amount_added: pendingOrder.amount,
      timestamp: 'Baru saja',
    };
    updateNotifications([newNotif, ...notifications.slice(0, 7)]);
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
        <div className="pt-3 text-center">
          <button
            type="button"
            className="w-full py-3 rounded-2xl bg-white hover:bg-[#eef5fc] border border-[#e4ecf2] text-[#3390ec] font-bold text-xs sm:text-sm shadow-2xs transition-colors cursor-pointer"
          >
            Tampilkan {Math.max(0, bots.length)} bot terdaftar
          </button>
        </div>
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
