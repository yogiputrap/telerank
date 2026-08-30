import { Bot, OutbidNotification } from '../types';

const BOTS_STORAGE_KEY = 'telerank_bots_v2';
const NOTIFS_STORAGE_KEY = 'telerank_notifs_v2';

export const getStoredBots = (): Bot[] => {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(BOTS_STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch {
    return [];
  }
};

export const saveStoredBots = (bots: Bot[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(BOTS_STORAGE_KEY, JSON.stringify(bots));
  } catch (e) {
    console.error('Error saving bots to localStorage', e);
  }
};

export const getStoredNotifications = (): OutbidNotification[] => {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(NOTIFS_STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch {
    return [];
  }
};

export const saveStoredNotifications = (notifs: OutbidNotification[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(NOTIFS_STORAGE_KEY, JSON.stringify(notifs));
  } catch (e) {
    console.error('Error saving notifs to localStorage', e);
  }
};
