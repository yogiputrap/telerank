'use client';

import React from 'react';
import { BotCategory, BOT_CATEGORIES } from '../types';

interface FilterBarProps {
  activeCategory: BotCategory;
  onSelectCategory: (cat: BotCategory) => void;
  timeFilter: string;
  onSelectTimeFilter: (time: string) => void;
}

const CATEGORIES: { id: BotCategory; label: string }[] = [
  { id: 'ALL', label: 'Semua' },
  ...BOT_CATEGORIES,
];

export const FilterBar: React.FC<FilterBarProps> = ({
  activeCategory,
  onSelectCategory,
  timeFilter,
  onSelectTimeFilter,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto my-6 px-4 space-y-3" id="leaderboard">
      {/* Time Filters Bar */}
      <div className="flex items-center gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
        <button
          onClick={() => onSelectTimeFilter('ALL')}
          className={`flex items-center gap-1 transition-colors cursor-pointer ${
            timeFilter === 'ALL' ? 'text-slate-900 font-extrabold' : 'hover:text-slate-600'
          }`}
        >
          <span>SEPANJANG WAKTU</span>
          {timeFilter === 'ALL' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
        </button>
        <span>•</span>
        <button
          onClick={() => onSelectTimeFilter('WEEK')}
          className={`transition-colors cursor-pointer ${
            timeFilter === 'WEEK' ? 'text-slate-900 font-extrabold' : 'hover:text-slate-600'
          }`}
        >
          MINGGU INI
        </button>
        <span>•</span>
        <button
          onClick={() => onSelectTimeFilter('DAY')}
          className={`transition-colors cursor-pointer ${
            timeFilter === 'DAY' ? 'text-slate-900 font-extrabold' : 'hover:text-slate-600'
          }`}
        >
          24 JAM
        </button>
      </div>

      {/* Category Pills Switcher */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100/90 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
