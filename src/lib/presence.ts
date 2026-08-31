/**
 * Real-time Active Presence & Visitor Tracking
 * Tracks distinct active client sessions within a 3-minute sliding window.
 */

interface PresenceState {
  activeClients: Map<string, number>;
  dailyVisitors: Set<string>;
  currentDateStr: string;
  lifetimeVisitorsBase: number;
}

const PRESENCE_TTL_MS = 3 * 60 * 1000; // 3 minutes active window
const MAX_PRESENCE_ENTRIES = 5000;

const state: PresenceState = {
  activeClients: new Map(),
  dailyVisitors: new Set(),
  currentDateStr: new Date().toISOString().slice(0, 10),
  lifetimeVisitorsBase: 0,
};

function cleanupStalePresence() {
  const now = Date.now();
  const today = new Date().toISOString().slice(0, 10);

  // Reset daily unique visitor set on date change
  if (state.currentDateStr !== today) {
    state.lifetimeVisitorsBase += state.dailyVisitors.size;
    state.dailyVisitors.clear();
    state.currentDateStr = today;
  }

  for (const [key, lastSeen] of state.activeClients.entries()) {
    if (now - lastSeen > PRESENCE_TTL_MS) {
      state.activeClients.delete(key);
    }
  }

  // Bounded protection
  if (state.activeClients.size > MAX_PRESENCE_ENTRIES) {
    const oldestKeys = Array.from(state.activeClients.keys()).slice(0, 1000);
    for (const k of oldestKeys) {
      state.activeClients.delete(k);
    }
  }
}

// Prune every 30 seconds
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupStalePresence, 30_000);
}

/**
 * Records an active client ping and returns current live presence stats.
 */
export function touchPresence(clientKey: string): { onlineCount: number; visitorCount: number } {
  cleanupStalePresence();

  if (clientKey) {
    state.activeClients.set(clientKey, Date.now());
    state.dailyVisitors.add(clientKey);
  }

  const onlineCount = Math.max(1, state.activeClients.size);
  const visitorCount = Math.max(1, state.lifetimeVisitorsBase + state.dailyVisitors.size);

  return {
    onlineCount,
    visitorCount,
  };
}

/**
 * Reads current presence stats without modifying state.
 */
export function getPresenceStats(): { onlineCount: number; visitorCount: number } {
  cleanupStalePresence();
  return {
    onlineCount: Math.max(1, state.activeClients.size),
    visitorCount: Math.max(1, state.lifetimeVisitorsBase + state.dailyVisitors.size),
  };
}
