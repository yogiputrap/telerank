'use client';

import React from 'react';
import { MgcTelegram } from './MingCuteIcons';
import { OutbidNotification } from '../types';

interface RecentActivitySectionProps {
  notifications: OutbidNotification[];
}

export const RecentActivitySection: React.FC<RecentActivitySectionProps> = ({
  notifications,
}) => {
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
        {notifications.slice(0, 8).map((notif) => (
          <div
            key={notif.id}
            className="p-2.5 rounded-2xl bg-white border border-[#e4ecf2] shadow-2xs space-y-1 hover:border-[#3390ec]/30 transition-colors"
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#eef5fc] text-[#3390ec] font-black text-[10px] flex items-center justify-center shrink-0">
                {notif.bot_name.charAt(0)}
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
        ))}
      </div>
    </div>
  );
};
