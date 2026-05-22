// ═══════════════════════════════════════════
// Toast System
// ═══════════════════════════════════════════
const toastQueue = [];
let toastListener = null;

export function showToast(message, type = "success", duration = 2500) {
    const id = Date.now() + Math.random();
    const toast = { id, message, type, duration };

    toastQueue.push(toast);
    if (toastListener) toastListener([...toastQueue]);

    // Auto-dismiss: first mark as exiting, then remove
    setTimeout(() => {
        const idx = toastQueue.findIndex((t) => t.id === id);
        if (idx === -1) return;

        toastQueue[idx] = { ...toastQueue[idx], exiting: true };
        if (toastListener) toastListener([...toastQueue]);

        setTimeout(() => {
            const removeIdx = toastQueue.findIndex((t) => t.id === id);
            if (removeIdx > -1) toastQueue.splice(removeIdx, 1);
            if (toastListener) toastListener([...toastQueue]);
        }, 300);
    }, duration);
}

export function subscribeToToasts(listener) {
    toastListener = listener;
    return () => { toastListener = null; };
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

export function readUsers() {
    const users = readJson("azkar_users", []);
    if (!Array.isArray(users)) return [];
    return users
        .filter((user) => user && typeof user.email === "string" && user.email.trim())
        .map((user) => ({ ...user, email: user.email.trim().toLowerCase() }));
}

export function writeUsers(users) {
    if (!Array.isArray(users)) return;
    const normalizedUsers = users
        .filter((user) => user && typeof user.email === "string" && user.email.trim())
        .map((user) => ({ ...user, email: user.email.trim().toLowerCase() }));
    writeJson("azkar_users", normalizedUsers);
}

export function findUserByEmail(email) {
    if (!email || typeof email !== "string") return null;
    const normalized = email.trim().toLowerCase();
    return readUsers().find((user) => user.email === normalized) || null;
}

export function getUserStorageSuffix(email) {
    if (!email || typeof email !== "string") return "";
    const normalized = email.trim().toLowerCase().replace(/[^a-z0-9]/g, "_");
    return normalized ? `_${normalized}` : "";
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
