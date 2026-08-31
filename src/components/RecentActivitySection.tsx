'use client';

import React from 'react';
import { Bot, OutbidNotification } from '../types';

interface RecentActivitySectionProps {
  notifications: OutbidNotification[];
  bots?: Bot[];
}

export const RecentActivitySection: React.FC<RecentActivitySectionProps> = ({
  notifications,
  bots,
}) => {
  const getBotAvatar = (notif: OutbidNotification) => {
    if (notif.avatar_url && notif.avatar_url.trim()) return notif.avatar_url;
    if (bots && bots.length > 0) {
      const rawUser = notif.telegram_username?.replace(/^@/, '').toLowerCase().trim();
      const rawName = notif.bot_name?.toLowerCase().trim();
      const found = bots.find(
        (b) =>
          (rawUser && b.telegram_username.replace(/^@/, '').toLowerCase().trim() === rawUser) ||
          (rawName && b.bot_name.toLowerCase().trim() === rawName)
      );
      if (found?.avatar_url) return found.avatar_url;
    }
    if (notif.telegram_username) {
      const clean = notif.telegram_username.replace(/^@/, '').trim().toLowerCase();
      if (clean) return `https://api.dicebear.com/7.x/bottts/svg?seed=${clean}`;
    }
    return '';
  };

  return (
    <div className="w-full my-4 space-y-2.5">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#3390ec] animate-tg-pulse" />
          <span className="text-xs font-bold text-[#1c242b] uppercase tracking-wider">
            Live Feed Aktivitas Sponsor
          </span>
        </div>
        <span className="text-[10px] text-[#707579] font-mono">Real-time Webhook</span>
      </div>

      {/* 2x4 Compact Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {notifications.slice(0, 8).map((notif) => {
          const avatarSrc = getBotAvatar(notif);
          return (
            <div
              key={notif.id}
              className="p-2.5 rounded-2xl bg-white border border-[#e4ecf2] shadow-2xs space-y-1 hover:border-[#3390ec]/30 transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className="relative w-7 h-7 rounded-lg overflow-hidden bg-[#eef5fc] border border-[#e4ecf2] shrink-0 flex items-center justify-center">
                  <span className="text-[#3390ec] font-black text-[10px] select-none">
                    {notif.bot_name ? notif.bot_name.charAt(0).toUpperCase() : '@'}
                  </span>
                  {avatarSrc ? (
                    <img
                      src={avatarSrc}
                      alt={notif.bot_name}
                      className="absolute inset-0 w-full h-full object-cover z-10"
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-xs text-[#1c242b] truncate leading-tight">
                    {notif.bot_name.split('—')[0].trim()}
                  </div>
                  <div className="text-[10px] text-[#3390ec] font-mono font-bold">
                    #{notif.new_rank} • Rp{notif.amount_added.toLocaleString('id-ID')}
                  </div>
                </div>
              </div>
              <div className="text-[9px] text-[#707579] pt-0.5 border-t border-[#f0f2f5]">
                {notif.timestamp}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
