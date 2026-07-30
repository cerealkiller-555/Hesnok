// ═══════════════════════════════════════════
// Toast System
// ═══════════════════════════════════════════
const toastQueue = [];
let toastListener = null;
const toastTimeouts = new Set();

export function showToast(message, type = "success", duration = 2500) {
    const id = Date.now() + Math.random();
    const toast = { id, message, type, duration };

    toastQueue.push(toast);
    if (toastListener) toastListener([...toastQueue]);

    // Auto-dismiss: first mark as exiting, then remove
    const timeoutId = setTimeout(() => {
        const idx = toastQueue.findIndex((t) => t.id === id);
        if (idx === -1) return;

        toastQueue[idx] = { ...toastQueue[idx], exiting: true };
        if (toastListener) toastListener([...toastQueue]);

        setTimeout(() => {
            const removeIdx = toastQueue.findIndex((t) => t.id === id);
            if (removeIdx > -1) toastQueue.splice(removeIdx, 1);
            toastTimeouts.delete(timeoutId);
            if (toastListener) toastListener([...toastQueue]);
        }, 300);
    }, duration);
    
    toastTimeouts.add(timeoutId);
}

export function subscribeToToasts(listener) {
    toastListener = listener;
    return () => { 
        toastListener = null; 
        // Cleanup any pending timeouts on unmount
        toastTimeouts.forEach(clearTimeout);
        toastTimeouts.clear();
    };
}

// ═══════════════════════════════════════════
// localStorage Helpers
// ═══════════════════════════════════════════
export function readJson(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch {
        return fallback;
    }
}

export function writeJson(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.warn("localStorage write failed:", e);
    }
}

/**
 * Read daily-scoped state from localStorage.
 * Returns `{}` if the stored date differs from today.
 */
export function readDailyState(key) {
    const saved = readJson(key, null);
    if (!saved || saved.date !== new Date().toDateString()) return {};
    return saved.items || {};
}

// ═══════════════════════════════════════════
// Prayer Time Utilities
// ═══════════════════════════════════════════
export function parsePrayerTime(timeStr) {
    if (!timeStr || typeof timeStr !== 'string') return null;
    const [hour, minute] = timeStr.split(':').map((n) => parseInt(n, 10));
    if (Number.isNaN(hour) || Number.isNaN(minute)) return null;
    const date = new Date();
    date.setHours(hour, minute, 0, 0);
    return date;
}

export function formatPrayerTime(timeStr, language) {
    const date = parsePrayerTime(timeStr);
    if (!date) return "--:--";
    return date.toLocaleTimeString(language === 'en' ? 'en-US' : 'ar-EG', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

// ═══════════════════════════════════════════
// Date Helpers
// ═══════════════════════════════════════════
function dateKey(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

export function isSameDay(a, b) {
    return dateKey(a) === dateKey(b);
}

export function isYesterday(previous, today) {
    const oneDay = 24 * 60 * 60 * 1000;
    return dateKey(today) - dateKey(previous) === oneDay;
}