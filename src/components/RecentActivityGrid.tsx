'use client';

import React from 'react';
import { OutbidNotification } from '../types';

interface RecentActivityGridProps {
  notifications: OutbidNotification[];
}

export const RecentActivityGrid: React.FC<RecentActivityGridProps> = ({
  notifications,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 my-6">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2 h-2 rounded-full bg-amber-500" />
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Aktivitas terbaru
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {notifications.slice(0, 4).map((notif) => (
          <div
            key={notif.id}
            className="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1.5"
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center text-amber-800 font-bold text-xs">
                {notif.bot_name.charAt(0)}
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
        ))}
      </div>
    </div>
  );
};
