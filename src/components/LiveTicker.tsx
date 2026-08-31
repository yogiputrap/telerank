'use client';

import React from 'react';
import { Flame, Zap } from 'lucide-react';
import { OutbidNotification } from '../types';

interface LiveTickerProps {
  notifications: OutbidNotification[];
}

export const LiveTicker: React.FC<LiveTickerProps> = ({ notifications }) => {
  return (
    <div className="bg-gradient-to-r from-teal-50/80 via-sky-50/80 to-emerald-50/80 border-b border-teal-100 py-2 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center gap-3 text-xs">
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-amber-500 text-white font-bold uppercase tracking-wider shrink-0 text-[10px] shadow-xs">
          <Flame className="w-3 h-3 fill-white" />
          <span>Live Salip</span>
        </div>

        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar whitespace-nowrap py-0.5 text-slate-600 font-medium">
          {notifications.map((notif, idx) => (
            <div key={notif.id} className="inline-flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <span>
                <strong className="text-slate-900">@{notif.telegram_username}</strong> naik ke peringkat{' '}
                <span className="text-teal-700 font-bold">#{notif.new_rank}</span>{' '}
                <span className="text-emerald-600 font-semibold">(+Rp {notif.amount_added.toLocaleString('id-ID')})</span>
              </span>
              <span className="text-slate-400 text-[11px]">• {notif.timestamp}</span>
              {idx < notifications.length - 1 && <span className="text-slate-300 mx-2">|</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
