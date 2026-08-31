'use client';

import React from 'react';
import { Flame, Download, Bot as BotIcon, MessageSquare, Gamepad2, Wrench, ShoppingBag } from 'lucide-react';
import { BotCategory } from '../types';

interface CategoryFilterProps {
  activeCategory: BotCategory;
  onSelectCategory: (category: BotCategory) => void;
}

const CATEGORIES: { id: BotCategory; label: string; icon: React.ReactNode }[] = [
  { id: 'ALL', label: 'Semua Bot', icon: <Flame className="w-3.5 h-3.5" /> },
  { id: 'DOWNLOADER', label: 'Downloader', icon: <Download className="w-3.5 h-3.5" /> },
  { id: 'AI_CHAT', label: 'AI Chat', icon: <BotIcon className="w-3.5 h-3.5" /> },
  { id: 'GAMES_HIBURAN', label: 'Games & Hiburan', icon: <Gamepad2 className="w-3.5 h-3.5" /> },
  { id: 'DEV_API', label: 'Developer & AI API', icon: <Wrench className="w-3.5 h-3.5" /> },
  { id: 'STORE_TOPUP', label: 'Store & Topup', icon: <ShoppingBag className="w-3.5 h-3.5" /> },
];

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  activeCategory,
  onSelectCategory,
}) => {
  return (
    <div className="flex items-center justify-center my-6" id="kategori">
      {/* Segmented Pill Switcher matching reference */}
      <div className="inline-flex items-center p-1.5 rounded-xl bg-white border border-slate-200/90 shadow-xs overflow-x-auto no-scrollbar max-w-full">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          const activeClass = isActive
            ? "bg-teal-600 text-white font-bold shadow-sm"
            : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium";
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs transition-all whitespace-nowrap cursor-pointer ${activeClass}`}
            >
              {cat.icon}
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
