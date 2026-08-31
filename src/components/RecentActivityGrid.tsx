'use client';

import React from 'react';
import { Bot, OutbidNotification } from '../types';

interface RecentActivityGridProps {
  notifications: OutbidNotification[];
  bots?: Bot[];
}

export const RecentActivityGrid: React.FC<RecentActivityGridProps> = ({
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
    <div className="w-full max-w-4xl mx-auto px-4 my-6">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2 h-2 rounded-full bg-amber-500" />
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Aktivitas terbaru
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {notifications.slice(0, 4).map((notif) => {
          const avatarSrc = getBotAvatar(notif);
          return (
            <div
              key={notif.id}
              className="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1.5"
            >
              <div className="flex items-center gap-2">
                <div className="relative w-7 h-7 rounded-lg overflow-hidden bg-amber-100 border border-slate-200/80 shrink-0 flex items-center justify-center">
                  <span className="text-amber-800 font-bold text-xs select-none">
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
                  <h5 className="font-bold text-xs text-slate-900 truncate">
                    {notif.bot_name}
                  </h5>
                  <span className="text-[10px] text-slate-400 font-mono">
                    naik ke #{notif.new_rank} • Rp{notif.amount_added.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
              <div className="text-[10px] text-slate-400 pt-0.5 border-t border-slate-100">
                {notif.timestamp}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
