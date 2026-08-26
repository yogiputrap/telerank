import { Bot, OutbidNotification } from '../types';
import { INITIAL_BOTS, INITIAL_NOTIFICATIONS } from './mockData';

const BOTS_STORAGE_KEY = 'telerank_bots_v1';
const NOTIFS_STORAGE_KEY = 'telerank_notifs_v1';

export const getStoredBots = (): Bot[] => {
  if (typeof window === 'undefined') return INITIAL_BOTS;
  try {
    const data = localStorage.getItem(BOTS_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(BOTS_STORAGE_KEY, JSON.stringify(INITIAL_BOTS));
      return INITIAL_BOTS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_BOTS;
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
  if (typeof window === 'undefined') return INITIAL_NOTIFICATIONS;
  try {
    const data = localStorage.getItem(NOTIFS_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(NOTIFS_STORAGE_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
      return INITIAL_NOTIFICATIONS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_NOTIFICATIONS;
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
