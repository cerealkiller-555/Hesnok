import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Clock, Moon, Sun, BookOpen, Settings } from 'lucide-react';
import {
    ICONS, DAILY_TAB_IDS, OFFLINE_PRAYER_TIMES,
    PRAYER_CHECKLIST, I18N, azkar, defaultCustomDuas, tabConfig
} from '../utils/constants';
import {
    showToast, readJson, readDailyState, writeJson, readUsers, writeUsers, findUserByEmail, getUserStorageSuffix, isSameDay, isYesterday, hashString
} from '../utils/helpers';

import ToastContainer   from './ToastContainer';
import ScrollToTop      from './ScrollToTop';
import OfflineBanner    from './OfflineBanner';
import PrayerTimesSection from './PrayerTimesSection';
import CustomDuasSection  from './CustomDuasSection';
import SettingsSection    from './SettingsSection';
import StreakBanner        from './StreakBanner';
import LoginScreen         from './LoginScreen';
import ZikrCard            from './ZikrCard';
import Logo                from './Logo';

const createId = () => {
    if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
    return `${Date.now()}_${Math.random().toString(36).slice(2)}`;
};

const normalizeCustomDuas = (duas) => {
    if (!Array.isArray(duas)) return [];
    return duas
        .map((dua, index) => {
            if (typeof dua === "string") {
                return { id: `seed_${index}_${dua.slice(0, 12)}`, text: dua };
            }
            if (dua && typeof dua === "object" && typeof dua.text === "string") {
                return { id: dua.id ?? `dua_${index}`, text: dua.text };
            }
            return null;
        })
        .filter((dua) => dua && dua.text.trim());
};

const PRAYER_BANNERS = [
    { key: "Fajr",    ar: "الفجر",   en: "Fajr",    icon: "🌅" },
    { key: "Dhuhr",   ar: "الظهر",   en: "Dhuhr",   icon: "🌞" },
    { key: "Asr",     ar: "العصر",   en: "Asr",     icon: "🌤️" },
    { key: "Maghrib", ar: "المغرب",  en: "Maghrib", icon: "🌆" },
    { key: "Isha",    ar: "العشاء",  en: "Isha",    icon: "🌙" }
];

const ACCENT_OPTIONS = [
    { id: "indigo", labelAr: "أزرق ملكي", labelEn: "Indigo", vars: { '--primary': '#6366f1', '--primary-light': '#818cf8', '--primary-dark': '#4f46e5', '--accent': '#f59e0b', '--accent-light': '#fbbf24', '--accent-dark': '#d97706', '--accent-glow': 'rgba(99, 102, 241, 0.25)', '--primary-rgb': '99,102,241', '--accent-rgb': '245,158,11' }, darkVars: { '--primary': '#818cf8', '--primary-light': '#a5b4fc', '--primary-dark': '#6366f1', '--accent': '#fbbf24', '--accent-light': '#fcd34d', '--accent-dark': '#f59e0b', '--accent-glow': 'rgba(251, 191, 36, 0.25)', '--primary-rgb': '129,140,248', '--accent-rgb': '251,191,36' } },
    { id: "emerald", labelAr: "أخضر زمردي", labelEn: "Emerald", vars: { '--primary': '#10b981', '--primary-light': '#34d399', '--primary-dark': '#059669', '--accent': '#14b8a6', '--accent-light': '#2dd4bf', '--accent-dark': '#0f766e', '--accent-glow': 'rgba(20, 184, 166, 0.25)', '--primary-rgb': '16,185,129', '--accent-rgb': '20,184,166' }, darkVars: { '--primary': '#34d399', '--primary-light': '#6ee7b7', '--primary-dark': '#10b981', '--accent': '#2dd4bf', '--accent-light': '#5eead4', '--accent-dark': '#14b8a6', '--accent-glow': 'rgba(45, 212, 191, 0.25)', '--primary-rgb': '52,211,153', '--accent-rgb': '45,212,191' } },
    { id: "rose", labelAr: "وردي ناعم", labelEn: "Rose", vars: { '--primary': '#ec4899', '--primary-light': '#f472b6', '--primary-dark': '#be185d', '--accent': '#f97316', '--accent-light': '#fb923c', '--accent-dark': '#ea580c', '--accent-glow': 'rgba(236, 72, 153, 0.2)', '--primary-rgb': '236,72,153', '--accent-rgb': '249,115,22' }, darkVars: { '--primary': '#f472b6', '--primary-light': '#fbcfe8', '--primary-dark': '#ec4899', '--accent': '#fb923c', '--accent-light': '#fdba74', '--accent-dark': '#f97316', '--accent-glow': 'rgba(251, 146, 60, 0.25)', '--primary-rgb': '244,114,182', '--accent-rgb': '251,146,60' } },
    { id: "teal", labelAr: "أخضر بحري", labelEn: "Teal", vars: { '--primary': '#14b8a6', '--primary-light': '#2dd4bf', '--primary-dark': '#0f766e', '--accent': '#22d3ee', '--accent-light': '#67e8f9', '--accent-dark': '#0e7490', '--accent-glow': 'rgba(20, 184, 166, 0.25)', '--primary-rgb': '20,184,166', '--accent-rgb': '34,211,238' }, darkVars: { '--primary': '#2dd4bf', '--primary-light': '#5eead4', '--primary-dark': '#14b8a6', '--accent': '#67e8f9', '--accent-light': '#a5f3fc', '--accent-dark': '#22d3ee', '--accent-glow': 'rgba(103, 232, 249, 0.25)', '--primary-rgb': '45,212,191', '--accent-rgb': '103,232,249' } }
];

const SOUND_OPTIONS = [
    { id: "bell", labelAr: "جرس ناعم", labelEn: "Soft bell" },
    { id: "chime", labelAr: "تلويحة", labelEn: "Gentle chime" },
    { id: "beep", labelAr: "تنبيه سريع", labelEn: "Quick beep" }
];

// ═══════════════════════════════════════════════════════
// AzkarApp — Root Component
//
// HOOK ORDERING RULES (prevents TDZ crash):
//   1. All useState declarations first
//   2. All useMemo / useCallback that derive from state
//   3. All useEffect hooks last
// ═══════════════════════════════════════════════════════

const AzkarApp = () => {
    // ───────────────────────────────────────
    // 1. STATE DECLARATIONS (all at the top)
    // ───────────────────────────────────────
    const [isOffline, setIsOffline]       = useState(!navigator.onLine);
    const [isDarkMode, setIsDarkMode]     = useState(() => localStorage.getItem("azkarDarkMode") === "true");
    const [arabicFontSize, setArabicFontSize] = useState(() => parseInt(localStorage.getItem("azkar_fontSize")) || 100);
    const [language, setLanguage]         = useState(() => localStorage.getItem("azkar_language") || "ar");
    const [activeTab, setActiveTab]       = useState(() => localStorage.getItem("azkar_activeTab") || "morning");
    const [userProfile, setUserProfile]   = useState(() => readJson("azkar_user", { name: "", email: "" }));
    const [savedUsers, setSavedUsers]     = useState(() => readUsers());
    const [isLoggedIn, setIsLoggedIn]     = useState(() => {
        const saved = readJson("azkar_user", null);
        return Boolean(saved && (saved.name || saved.email));
    });
    const [storageReady, setStorageReady] = useState(false);
    const [showEnTranslations, setShowEnTranslations] = useState(() => localStorage.getItem("azkar_showEnTranslations") === "true");
    const [accentColor, setAccentColor]   = useState(() => localStorage.getItem("azkar_accentColor") || "indigo");
    const [notificationSound, setNotificationSound] = useState(() => localStorage.getItem("azkar_notificationSound") || "bell");
    const [enablePrayerNotifications, setEnablePrayerNotifications] = useState(() => localStorage.getItem("azkar_prayerNotifications") === "true");
    const [enableAzkarNotifications, setEnableAzkarNotifications] = useState(() => localStorage.getItem("azkar_azkarNotifications") === "true");

    const [prayerTimes, setPrayerTimes]   = useState(null);
    const [location, setLocation]         = useState(() => readJson("azkar_location", { city: "Cairo", country: "EG" }));
    const [currentTime, setCurrentTime]   = useState(new Date());

    const [completedAzkar, setCompletedAzkar]     = useState({});
    const [azkarProgress, setAzkarProgress]       = useState({});
    const [prayerChecklist, setPrayerChecklist]    = useState({});
    const [streak, setStreak]                     = useState({ count: 0, lastDate: null });
    const [customDuas, setCustomDuas]             = useState(() => normalizeCustomDuas(readJson("azkar_customDuas", defaultCustomDuas)));
    const [newDua, setNewDua]                     = useState("");

    const [expandedBenefits, setExpandedBenefits] = useState({});
    const [countAnimation, setCountAnimation]     = useState(null);
    const [deferredPrompt, setDeferredPrompt]     = useState(null);
    const [highlightedZikr, setHighlightedZikr]   = useState(null);
    const [nextFocusZikr, setNextFocusZikr]       = useState(null);

    // Refs
    const completedAzkarRef = useRef(completedAzkar);
    const azkarProgressRef  = useRef(azkarProgress);
    const toastShownRef     = useRef(new Set());
    const notificationTimersRef = useRef([]);

    // ───────────────────────────────────────
    // 2. DERIVED VALUES (useMemo / useCallback)
    // ───────────────────────────────────────
    const userSuffix = useMemo(
        () => (isLoggedIn && userProfile.email ? getUserStorageSuffix(userProfile.email) : ""),
        [isLoggedIn, userProfile.email]
    );

    const t = useMemo(() => I18N[language] || I18N.ar, [language]);

    const timeOfDayTheme = useMemo(() => {
        const hour = currentTime.getHours();
        if (hour >= 4 && hour < 10) return "theme-morning";
        if (hour >= 10 && hour < 15) return "theme-noon";
        if (hour >= 15 && hour < 19) return "theme-evening";
        return "theme-night";
    }, [currentTime]);

    const currentAzkarList = useMemo(() => {
        const map = {
            morning: azkar.morning,
            evening: azkar.evening,
            sleeping: azkar.sleeping,
            prayer_azkar: azkar.prayerAzkar,
            jawami: azkar.jawami
        };
        return map[activeTab] || [];
    }, [activeTab]);

    const progressPercentage = useMemo(() => {
        if (!currentAzkarList.length) return 0;
        const totalCounts   = currentAzkarList.reduce((s, z) => s + z.count, 0);
        const currentCounts = currentAzkarList.reduce((s, z) => {
            const key = `${activeTab}_${z.id}`;
            return s + Math.min(azkarProgress[key] || 0, z.count);
        }, 0);
        if (currentCounts === 0) return 0;
        return Math.max(1, Math.round((currentCounts / totalCounts) * 100));
    }, [activeTab, azkarProgress, currentAzkarList]);

    const completedCount = useMemo(
        () => currentAzkarList.filter((z) => completedAzkar[`${activeTab}_${z.id}`]).length,
        [activeTab, completedAzkar, currentAzkarList]
    );

    const formatTime = useCallback(
        () => currentTime.toLocaleTimeString(language === "en" ? "en-US" : "ar-EG", { hour: "numeric", minute: "2-digit", hour12: true }),
        [currentTime, language]
    );

    // Daily goal checks
    const morningCompleted  = useMemo(() => azkar.morning.every((z) => completedAzkar[`morning_${z.id}`]), [completedAzkar]);
    const eveningCompleted  = useMemo(() => azkar.evening.every((z) => completedAzkar[`evening_${z.id}`]), [completedAzkar]);
    const prayersCompleted  = useMemo(() => PRAYER_CHECKLIST.every((p) => prayerChecklist[p.id]), [prayerChecklist]);
    const sleepCompleted    = useMemo(() => azkar.sleeping.every((z) => completedAzkar[`sleeping_${z.id}`]), [completedAzkar]);
    const jawamiCompleted   = useMemo(() => azkar.jawami.every((z) => completedAzkar[`jawami_${z.id}`]), [completedAzkar]);
    
    // Streak counts if morning and evening are done (standard requirement)
    const dailyGoalsComplete = morningCompleted && eveningCompleted;

    const tabs = useMemo(() => tabConfig.map(tab => ({
        ...tab,
        icon: ICONS[tab.icon],
        labelText: language === "en" ? tab.labelEn || tab.label : tab.label
    })), [language]);

    const goals = useMemo(() => [
        { id: "morning",  label: t.goalMorning,  completed: morningCompleted },
        { id: "evening",  label: t.goalEvening,  completed: eveningCompleted },
        { id: "prayers",  label: t.goalPrayers,  completed: prayersCompleted }
    ], [t, morningCompleted, eveningCompleted, prayersCompleted]);

    // Calculate completion counts for all daily tabs for navigation badges
    const tabProgress = useMemo(() => {
        const result = {};
        DAILY_TAB_IDS.forEach(tabId => {
            const list = azkar[tabId === "prayer_azkar" ? "prayerAzkar" : tabId] || [];
            const completed = list.filter(z => completedAzkar[`${tabId}_${z.id}`]).length;
            result[tabId] = { completed, total: list.length, isAllDone: list.length > 0 && completed === list.length };
        });
        return result;
    }, [completedAzkar]);

    // Prayer times fetcher
    const fetchPrayerTimes = useCallback(async () => {
        try {
            const now  = new Date();
            const date = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;
            const url  = `https://api.aladhan.com/v1/timingsByCity/${date}?city=${encodeURIComponent(location.city)}&country=${encodeURIComponent(location.country)}&method=5`;
            const res  = await fetch(url);
            const data = await res.json();
            if (data.code === 200) { setPrayerTimes(data.data.timings); return; }
        } catch (e) {
            console.error("Prayer times fetch failed:", e);
        }
        setPrayerTimes(OFFLINE_PRAYER_TIMES);
    }, [location]);

    // Auto-advance: scroll to next incomplete zikr
    const scrollToNextZikr = useCallback((currentId, list, type) => {
        const currentIndex = list.findIndex((z) => `${type}_${z.id}` === currentId);
        const remaining    = list.slice(currentIndex + 1);
        const nextIncomplete = remaining.find((z) => !completedAzkarRef.current[`${type}_${z.id}`]);

        if (nextIncomplete) {
            const nextId = `${type}_${nextIncomplete.id}`;
            setNextFocusZikr(nextId);
        }
    }, []);

    const showOncePerAction = useCallback((key, message, type = "success") => {
        if (toastShownRef.current.has(key)) return;
        toastShownRef.current.add(key);
        showToast(message, type);
        setTimeout(() => toastShownRef.current.delete(key), 1000);
    }, []);

    const parsePrayerTime = useCallback((timeStr) => {
        if (!timeStr || typeof timeStr !== 'string') return null;
        const [hour, minute] = timeStr.split(':').map((n) => parseInt(n, 10));
        if (Number.isNaN(hour) || Number.isNaN(minute)) return null;
        const date = new Date();
        date.setHours(hour, minute, 0, 0);
        return date;
    }, []);

    const prayerHeaders = useMemo(() => {
        if (!prayerTimes) return [];
        const headers = PRAYER_BANNERS.map((prayer) => {
            const time = prayerTimes[prayer.key] || "--:--";
            const date = parsePrayerTime(time);
            return {
                ...prayer,
                time,
                date,
                isNext: false
            };
        });

        const upcoming = headers.filter((item) => item.date && item.date > currentTime);
        if (upcoming.length) {
            const next = upcoming[0];
            return headers.map((item) => ({
                ...item,
                isNext: item.key === next.key
            }));
        }

        if (headers.length > 0 && headers[0].date) {
            const tomorrow = new Date(headers[0].date);
            tomorrow.setDate(tomorrow.getDate() + 1);
            return headers.map((item, index) => ({
                ...item,
                isNext: index === 0,
                date: index === 0 ? tomorrow : item.date
            }));
        }

        return headers;
    }, [prayerTimes, currentTime, parsePrayerTime]);

    const nextPrayer = useMemo(() => {
        return prayerHeaders.find((item) => item.isNext) || prayerHeaders[0] || null;
    }, [prayerHeaders]);

    const nextPrayerCountdown = useMemo(() => {
        if (!nextPrayer?.date) return null;
        const diffMs = nextPrayer.date.getTime() - currentTime.getTime();
        if (diffMs <= 0) return null;
        const totalMinutes = Math.floor(diffMs / 60000);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        if (hours > 0) {
            return language === 'en'
                ? `${hours}h ${minutes}m`
                : `${hours} ساعة و ${minutes} دقيقة`;
        }
        return language === 'en'
            ? `${minutes}m`
            : `${minutes} دقيقة`;
    }, [nextPrayer, currentTime, language]);

    const formatNextPrayerTime = useCallback((date) => {
        if (!date) return "--:--";
        return date.toLocaleTimeString(language === 'en' ? 'en-US' : 'ar-EG', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    }, [language]);

    const getAccentStyle = useCallback(() => {
        return ACCENT_OPTIONS.find((item) => item.id === accentColor) || ACCENT_OPTIONS[0];
    }, [accentColor]);

    const hexToRgb = useCallback((hex) => {
        const clean = hex.replace('#', '');
        const full = clean.length === 3 ? clean.split('').map((char) => char.repeat(2)).join('') : clean;
        const r = parseInt(full.slice(0, 2), 16);
        const g = parseInt(full.slice(2, 4), 16);
        const b = parseInt(full.slice(4, 6), 16);
        return `${r},${g},${b}`;
    }, []);

    const playReminderSound = useCallback((soundId) => {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            const context = new AudioContext();
            const oscillator = context.createOscillator();
            const gain = context.createGain();
            const sounds = {
                bell: { frequency: 880, duration: 0.35 },
                chime: { frequency: 440, duration: 0.45 },
                beep: { frequency: 520, duration: 0.18 }
            };
            const config = sounds[soundId] || sounds.bell;
            oscillator.type = 'sine';
            oscillator.frequency.value = config.frequency;
            gain.gain.value = 0.05;
            oscillator.connect(gain);
            gain.connect(context.destination);
            oscillator.start();
            oscillator.stop(context.currentTime + config.duration);
            oscillator.onended = () => context.close();
        } catch (e) {
            console.warn('Audio notification failed', e);
        }
    }, []);

    const requestNotificationPermission = useCallback(async () => {
        if (!('Notification' in window)) return false;
        if (Notification.permission === 'granted') return true;
        if (Notification.permission === 'denied') return false;
        const permission = await Notification.requestPermission();
        return permission === 'granted';
    }, []);

    const sendReminder = useCallback(async (title, body) => {
        if (!title) return;
        if (await requestNotificationPermission()) {
            new Notification(title, { body });
        }
        playReminderSound(notificationSound);
        showToast(body, 'info', 5500);
    }, [notificationSound, playReminderSound, requestNotificationPermission]);

    const scheduleReminder = useCallback((when, title, body) => {
        if (!when || when <= new Date()) return;
        const delay = when.getTime() - Date.now();
        const timer = window.setTimeout(() => sendReminder(title, body), delay);
        notificationTimersRef.current.push(timer);
    }, [sendReminder]);

    const clearScheduledReminders = useCallback(() => {
        notificationTimersRef.current.forEach((timer) => window.clearTimeout(timer));
        notificationTimersRef.current = [];
    }, []);

    const makeReminderText = useCallback((template, name) => {
        return template.replace('{name}', name || '').trim();
    }, []);

    // ───────────────────────────────────────
    // 3. EVENT HANDLERS
    // ───────────────────────────────────────
    const handleLogin = useCallback(async (profile, mode) => {
        const email = profile.email.trim().toLowerCase();
        const savedUser = findUserByEmail(email);
        const passwordHash = await hashString(profile.password);

        if (mode === "signin") {
            if (!savedUser) {
                showToast(t.userNotFound, "warning");
                return { success: false, error: t.userNotFound };
            }
            if (savedUser.passwordHash !== passwordHash) {
                showToast(t.wrongPassword, "warning");
                return { success: false, error: t.wrongPassword };
            }
            const userProfileData = { name: savedUser.name, email };
            setUserProfile(userProfileData);
            setIsLoggedIn(true);
            setStorageReady(false);
            writeJson("azkar_user", userProfileData);
            showToast(t.signedIn, "success");
            return { success: true };
        }

        if (savedUser) {
            showToast(t.userExists, "warning");
            return { success: false, error: t.userExists };
        }

        const newUser = { name: profile.name.trim(), email, passwordHash };
        const users = readUsers();
        const nextUsers = [...users, newUser];
        writeUsers(nextUsers);
        setSavedUsers(nextUsers);
        const userProfileData = { name: profile.name.trim(), email };
        setUserProfile(userProfileData);
        setIsLoggedIn(true);
        setStorageReady(false);
        writeJson("azkar_user", userProfileData);
        showToast(t.accountCreated, "success");
        return { success: true };
    }, [t]);

    const logout = useCallback(() => {
        setIsLoggedIn(false);
        setUserProfile({ name: "", email: "" });
        localStorage.removeItem("azkar_user");
        // Reset in-memory state
        setCompletedAzkar({});
        setAzkarProgress({});
        setPrayerChecklist({});
        setStreak({ count: 0, lastDate: null });
        completedAzkarRef.current = {};
        azkarProgressRef.current = {};
        toastShownRef.current.clear();
        setStorageReady(false);
        showToast(t.loggedOut, "info");
    }, [t]);

    const updateUserProfile = useCallback((profile) => {
        const updated = {
            ...userProfile,
            ...profile,
            name: profile.name ?? userProfile.name
        };
        setUserProfile(updated);
        writeJson("azkar_user", updated);
        const users = readUsers().map((user) => {
            if (user.email === updated.email) return updated;
            return user;
        });
        writeUsers(users);
        setSavedUsers(users);
    }, [userProfile]);

    const handleSelectExistingUser = useCallback((user) => {
        setUserProfile(user);
        setIsLoggedIn(true);
        setStorageReady(false);
        writeJson("azkar_user", user);
        showToast(t.loginSaved, "success");
    }, [t]);

    const handleZikrProgress = useCallback((id, max, list, type) => {
        if (completedAzkarRef.current[id]) return;
        if (navigator.vibrate) navigator.vibrate(40);

        setCountAnimation(id);
        setTimeout(() => setCountAnimation(null), 200);

        const next = Math.min((azkarProgressRef.current[id] || 0) + 1, max);
        const updatedProgress = { ...azkarProgressRef.current, [id]: next };
        azkarProgressRef.current = updatedProgress;
        setAzkarProgress(updatedProgress);

        if (next < max) {
            if (navigator.vibrate) navigator.vibrate(40);
            return;
        } else {
            if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
        }

        const updatedCompleted = { ...completedAzkarRef.current, [id]: true };
        completedAzkarRef.current = updatedCompleted;
        setCompletedAzkar(updatedCompleted);

        const sectionComplete = list.every((z) => updatedCompleted[`${type}_${z.id}`]);
        if (sectionComplete) {
            showOncePerAction(`${type}_section_complete`, t.allComplete, "success");
        } else {
            showOncePerAction(`${id}_complete`, t.progressCompleted, "success");
            scrollToNextZikr(id, list, type);
        }
    }, [t, scrollToNextZikr, showOncePerAction]);

    const toggleZikrComplete = useCallback((id, max) => {
        const done = !completedAzkarRef.current[id];
        const updated = { ...completedAzkarRef.current, [id]: done };
        const updatedProgress = { ...azkarProgressRef.current, [id]: done ? max : 0 };
        completedAzkarRef.current = updated;
        azkarProgressRef.current = updatedProgress;
        setCompletedAzkar(updated);
        setAzkarProgress(updatedProgress);
    }, []);

    const handleTogglePrayer = useCallback((prayerId) => {
        setPrayerChecklist((prev) => ({ ...prev, [prayerId]: !prev[prayerId] }));
    }, []);

    const toggleZikrBenefit = useCallback((uid) => {
        setExpandedBenefits((prev) => ({ ...prev, [uid]: !prev[uid] }));
    }, []);

    const handleTabChange = useCallback((tabId) => {
        if (!tabConfig.some((tab) => tab.id === tabId)) return;
        setActiveTab(tabId);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    const addCustomDua = useCallback(() => {
        if (!newDua.trim()) return;
        setCustomDuas((prev) => [...prev, { id: createId(), text: newDua.trim() }]);
        setNewDua("");
        showToast(t.duaAdded);
    }, [newDua, t]);

    const deleteCustomDua = useCallback((id) => {
        setCustomDuas((prev) => prev.filter((dua) => dua.id !== id));
        showToast(t.duaDeleted, "info");
    }, [t]);

    const resetAllProgress = useCallback(() => {
        if (!window.confirm(t.resetAllLabel)) return;
        setCompletedAzkar({});
        setAzkarProgress({});
        completedAzkarRef.current = {};
        azkarProgressRef.current = {};
        toastShownRef.current.clear();
        showToast(t.resetAllToast, "info");
    }, [t]);

    // ───────────────────────────────────────
    // 4. EFFECTS (all at the bottom)
    // ───────────────────────────────────────

    // Keep ref in sync
    useEffect(() => {
        completedAzkarRef.current = completedAzkar;
    }, [completedAzkar]);

    useEffect(() => {
        azkarProgressRef.current = azkarProgress;
    }, [azkarProgress]);

    // Helper to check if element is in viewport
    const isElementInViewport = (el) => {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    };

    useEffect(() => {
        if (!nextFocusZikr) return;

        let timers = [];

        // Highlight the next card without scrolling - just visual emphasis
        timers.push(
            setTimeout(() => {
                setHighlightedZikr(nextFocusZikr);
                // Optional: gentle scroll only if card is out of view
                const el = document.getElementById(`zikr-${nextFocusZikr}`);
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 250)
        );

        // Keep highlight visible longer
        timers.push(
            setTimeout(() => {
                setHighlightedZikr(null);
                setNextFocusZikr(null);
            }, 2800)
        );

        return () => {
            timers.forEach(timer => clearTimeout(timer));
        };
    }, [nextFocusZikr]);

    // Load user-scoped data when logged in or user changes
    useEffect(() => {
        if (!isLoggedIn || !userProfile.email) {
            setStorageReady(false);
            return;
        }
        const suffix = `_${userProfile.email}`;
        const savedCompleted = readDailyState(`azkar_completed${suffix}`);
        const savedProgress = readDailyState(`azkar_progress${suffix}`);
        completedAzkarRef.current = savedCompleted;
        azkarProgressRef.current = savedProgress;
        setCompletedAzkar(savedCompleted);
        setAzkarProgress(savedProgress);
        setPrayerChecklist(readDailyState(`azkar_prayerChecklist${suffix}`));
        setStreak(readJson(`azkar_streak${suffix}`, { count: 0, lastDate: null }));
        setStorageReady(true);
    }, [isLoggedIn, userProfile.email]);

    useEffect(() => {
        if (!isLoggedIn || !storageReady) return;
        const welcomeKey = `azkar_welcome_shown${userSuffix}`;
        const shown = readJson(welcomeKey, false);
        if (!shown) {
            showToast(makeReminderText(t.welcomeMessage, userProfile.name), 'success', 6000);
            writeJson(welcomeKey, true);
        }
    }, [isLoggedIn, storageReady, userProfile.name, userSuffix, t, makeReminderText]);

    useEffect(() => {
        if (!isLoggedIn || !dailyGoalsComplete) return;
        const praise = language === 'ar'
            ? ["أشطر كتكوت", "أشطر كتكوتة"][Math.floor(Math.random() * 2)]
            : t.goalCompleteMessage;
        const message = userProfile.name ? `${userProfile.name}، ${praise}` : praise;
        showOncePerAction('daily_goals_complete', message, 'success');
    }, [dailyGoalsComplete, isLoggedIn, language, showOncePerAction, userProfile.name, t]);

    // Persist user-scoped data
    useEffect(() => {
        if (!isLoggedIn || !userProfile.email || !storageReady) return;
        const today = new Date().toDateString();
        writeJson(`azkar_progress${userSuffix}`,       { date: today, items: azkarProgress });
        writeJson(`azkar_completed${userSuffix}`,      { date: today, items: completedAzkar });
        writeJson(`azkar_prayerChecklist${userSuffix}`, { date: today, items: prayerChecklist });
        writeJson(`azkar_streak${userSuffix}`,         streak);
    }, [azkarProgress, completedAzkar, prayerChecklist, streak, userSuffix, isLoggedIn, userProfile.email, storageReady]);

    // Persist custom duas
    useEffect(() => {
        writeJson("azkar_customDuas", normalizeCustomDuas(customDuas));
    }, [customDuas]);

    // Persist UI preferences
    useEffect(() => {
        const isValidTab = tabConfig.some((tab) => tab.id === activeTab);
        if (!isValidTab) setActiveTab("morning");
        else localStorage.setItem("azkar_activeTab", activeTab);
    }, [activeTab]);
    useEffect(() => {
        localStorage.setItem("azkarDarkMode", String(isDarkMode));
        document.documentElement.classList.toggle("dark", isDarkMode);
    }, [isDarkMode]);
    useEffect(() => { localStorage.setItem("azkar_language", language); }, [language]);
    useEffect(() => { localStorage.setItem("azkar_fontSize", arabicFontSize.toString()); }, [arabicFontSize]);
    useEffect(() => { localStorage.setItem("azkar_showEnTranslations", String(showEnTranslations)); }, [showEnTranslations]);
    useEffect(() => { writeJson("azkar_location", location); }, [location]);

    // Clock tick
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Fetch prayer times
    useEffect(() => { fetchPrayerTimes(); }, [fetchPrayerTimes]);

    // Online/offline detection
    useEffect(() => {
        const goOnline  = () => { setIsOffline(false); showToast(t.onlineNotice, "success"); };
        const goOffline = () => { setIsOffline(true); };
        window.addEventListener("online",  goOnline);
        window.addEventListener("offline", goOffline);
        return () => {
            window.removeEventListener("online",  goOnline);
            window.removeEventListener("offline", goOffline);
        };
    }, [t]);

    // PWA install prompt
    useEffect(() => {
        const handler = (e) => { e.preventDefault(); setDeferredPrompt(e); };
        window.addEventListener("beforeinstallprompt", handler);
        return () => window.removeEventListener("beforeinstallprompt", handler);
    }, []);

    useEffect(() => {
        const style = getAccentStyle();
        const root = document.documentElement;
        const currentVars = isDarkMode && style.darkVars ? style.darkVars : style.vars;
        Object.entries(currentVars).forEach(([key, value]) => root.style.setProperty(key, value));
        root.style.setProperty('--primary-rgb', hexToRgb(currentVars['--primary']));
        root.style.setProperty('--accent-rgb', hexToRgb(currentVars['--accent']));
        localStorage.setItem("azkar_accentColor", accentColor);
    }, [accentColor, getAccentStyle, hexToRgb, isDarkMode]);

    useEffect(() => {
        localStorage.setItem("azkar_notificationSound", notificationSound);
    }, [notificationSound]);

    useEffect(() => {
        localStorage.setItem("azkar_prayerNotifications", String(enablePrayerNotifications));
    }, [enablePrayerNotifications]);

    useEffect(() => {
        localStorage.setItem("azkar_azkarNotifications", String(enableAzkarNotifications));
    }, [enableAzkarNotifications]);

    useEffect(() => {
        if (!prayerTimes || !isLoggedIn) return;
        clearScheduledReminders();

        if (enablePrayerNotifications) {
            PRAYER_BANNERS.forEach((prayer) => {
                if (!prayerTimes[prayer.key]) return;
                const when = parsePrayerTime(prayerTimes[prayer.key]);
                const prayerName = language === "en" ? prayer.en : prayer.ar;
                const title = makeReminderText(t.notificationTitlePrayer, userProfile.name);
                const body = `${makeReminderText(t.notificationBodyPrayer, userProfile.name)} ${prayerName}`.trim();
                scheduleReminder(when, title, body);
            });
        }

        if (enableAzkarNotifications) {
            const morningTime = parsePrayerTime(prayerTimes.Fajr);
            const eveningTime = parsePrayerTime(prayerTimes.Maghrib);
            if (morningTime) {
                morningTime.setMinutes(morningTime.getMinutes() + 15);
                scheduleReminder(morningTime, makeReminderText(t.notificationTitleAzkar, userProfile.name), makeReminderText(t.notificationBodyAzkar, userProfile.name));
            }
            if (eveningTime) {
                eveningTime.setMinutes(eveningTime.getMinutes() + 15);
                scheduleReminder(eveningTime, makeReminderText(t.notificationTitleAzkar, userProfile.name), makeReminderText(t.notificationBodyAzkar, userProfile.name));
            }
        }

        return clearScheduledReminders;
    }, [prayerTimes, enablePrayerNotifications, enableAzkarNotifications, language, makeReminderText, scheduleReminder, t, isLoggedIn, userProfile.name, clearScheduledReminders]);

    // Streak updater — runs when dailyGoalsComplete changes
    useEffect(() => {
        if (!isLoggedIn || !dailyGoalsComplete) return;

        const today = new Date();
        const todayStr = today.toDateString();

        // Don't update if we already counted today
        if (streak.lastDate === todayStr) return;

        setStreak((prev) => {
            if (prev.lastDate) {
                const lastDate = new Date(prev.lastDate);
                if (isYesterday(lastDate, today)) {
                    // Consecutive day
                    return { count: prev.count + 1, lastDate: todayStr };
                } else if (!isSameDay(lastDate, today)) {
                    // Streak broken — restart
                    return { count: 1, lastDate: todayStr };
                }
            }
            // First time or same day (shouldn't happen due to guard above)
            return { count: Math.max(prev.count, 1), lastDate: todayStr };
        });
    }, [dailyGoalsComplete, isLoggedIn, streak.lastDate]);

    // ───────────────────────────────────────
    // 5. RENDER HELPERS
    // ───────────────────────────────────────
    const renderAzkarList = (list, type) => (
        <div className="space-y-6">
            {!storageReady ? (
                Array.from({ length: 5 }).map((_, i) => (
                    <div key={`skel-${i}`} className="glass-card h-48 rounded-2xl animate-pulse bg-white/20 dark:bg-slate-800/20" />
                ))
            ) : (
            list.map((z, i) => {
                const uid = `${type}_${z.id}`;
                return (
                    <ZikrCard
                        key={uid}
                        zikr={z}
                        index={i}
                        uniqueId={uid}
                        t={t}
                        language={language}
                        isCompleted={!!completedAzkar[uid]}
                        progress={azkarProgress[uid] || 0}
                        progressPct={((azkarProgress[uid] || 0) / z.count) * 100}
                        isAnimating={countAnimation === uid}
                        isHighlighted={highlightedZikr === uid}
                        isExpanded={!!expandedBenefits[uid]}
                        arabicFontSize={arabicFontSize}
                        showEnTranslations={showEnTranslations}
                        list={list}
                        listType={type}
                        onToggleBenefit={toggleZikrBenefit}
                        onToggleComplete={toggleZikrComplete}
                        onProgress={handleZikrProgress}
                    />
                );
            }))}
        </div>
    );

    // ───────────────────────────────────────
    // 6. RENDER
    // ───────────────────────────────────────
    if (!isLoggedIn) {
        return <LoginScreen
            onLogin={handleLogin}
            existingUsers={savedUsers}
            t={t}
            language={language}
        />;
    }

    return (
        <div
            className={`min-h-screen transition-all duration-1000 pattern-bg ${isDarkMode ? 'dark' : ''} ${timeOfDayTheme}`}
            dir={language === "ar" ? "rtl" : "ltr"}
        >
            <OfflineBanner offline={isOffline} t={t} />
            <ToastContainer />
            <ScrollToTop t={t} />

            {/* Header */}
            <header className="sticky top-0 z-50 glass-panel !rounded-none border-x-0 border-t-0 shadow-sm">
                <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleTabChange("morning")}>
                        <div className="w-10 h-10 rounded-lg bg-white dark:bg-[var(--bg-subtle)] flex items-center justify-center shadow-sm border border-[var(--glass-border)] transition-transform">
                            <Logo className="w-10 h-10 rounded-lg shadow-lg" mode={isDarkMode ? 'dark' : 'light'} />
                        </div>
                        <div>
                            <h1 className="text-lg font-black text-[var(--text-primary)] leading-none">{t.appName}</h1>
                            <p className="text-[10px] font-black uppercase tracking-wide text-[var(--text-secondary)] mt-1">{t.appTagline}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-surface text-text-primary font-bold border border-glass-border">
                            <Clock className="w-4 h-4 text-[var(--primary)]" />
                            <span className="text-sm font-mono">{formatTime()}</span>
                        </div>
                        <button onClick={() => setIsDarkMode((d) => !d)} className="p-2.5 rounded-lg bg-bg-surface text-text-secondary border border-glass-border hover:text-[var(--primary)]">
                            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                        <button onClick={() => handleTabChange("settings")} className={`p-2.5 rounded-lg border transition-all ${activeTab === "settings" ? "bg-[var(--primary)] text-white border-[var(--primary)]" : "bg-bg-surface text-text-secondary border-glass-border hover:text-[var(--primary)]"}`}>
                            <Settings className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Navigation (Desktop) */}
                <nav className="hidden md:block desktop-nav-wrapper">
                    <div className="container mx-auto px-4 py-3 flex items-center justify-center gap-2">
                        {tabs.map((tab) => {
                            const prog = tabProgress[tab.id];
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => handleTabChange(tab.id)}
                                    className={`desktop-nav-item relative ${activeTab === tab.id ? 'active' : ''} ${prog?.isAllDone ? 'border-emerald-500/30' : ''}`}
                                >
                                    <tab.icon className={`w-4 h-4 ${prog?.isAllDone ? 'text-emerald-500' : ''}`} />
                                    <span>{tab.labelText}</span>
                                    {/* removed numeric badge per UX request */}
                                </button>
                            );
                        })}
                    </div>
                </nav>
            </header>

            {nextPrayer && (
                <section className="container mx-auto px-4 py-3">
                    <div className="next-prayer-card mx-auto w-full max-w-3xl rounded-3xl border border-[var(--glass-border)] bg-[var(--bg-surface)] shadow-[0_12px_24px_rgba(15,23,42,0.08)] p-3 overflow-hidden">
                        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-3">
                            <div className="flex items-center justify-center flex-shrink-0 w-14 h-14 rounded-2xl bg-[var(--accent)]/15 text-[var(--accent)] shadow-sm shadow-[var(--accent)]/10 text-2xl">
                                {nextPrayer.icon}
                            </div>
                            <div className="flex-1 min-w-0 text-center sm:text-left">
                                <span className="inline-flex items-center justify-center rounded-full border border-[var(--accent)]/20 bg-[var(--accent)]/10 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-[0.35em] text-[var(--accent)]">
                                    {language === 'en' ? 'Next prayer' : 'الصلاة القادمة'}
                                </span>
                                <h2 className="mt-2 text-lg font-black text-[var(--text-primary)] leading-snug truncate">
                                    {language === 'en' ? nextPrayer.en : nextPrayer.ar}
                                </h2>
                                <p className="mt-1 text-2xl font-black text-[var(--accent)] leading-none" dir="ltr">
                                    {formatNextPrayerTime(nextPrayer.date)}
                                </p>
                                {nextPrayerCountdown && (
                                    <p className="mt-2 text-sm text-[var(--text-secondary)]">
                                        {language === 'en' ? 'In ' : 'بعد '}<span className="font-black text-[var(--text-primary)]">{nextPrayerCountdown}</span>
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Main content */}
            <main className="container mx-auto px-4 py-6 max-w-3xl space-y-6 animate-fade-in">
                <StreakBanner streakCount={streak.count} goals={goals} t={t} />

                <div className="space-y-6">
                    {activeTab === "morning"       && renderAzkarList(azkar.morning, "morning")}
                    {activeTab === "evening"       && renderAzkarList(azkar.evening, "evening")}
                    {activeTab === "sleeping"      && renderAzkarList(azkar.sleeping, "sleeping")}
                    {activeTab === "prayer_azkar"  && renderAzkarList(azkar.prayerAzkar, "prayer_azkar")}
                    {activeTab === "jawami"        && renderAzkarList(azkar.jawami, "jawami")}

                    {activeTab === "prayer" && (
                        <div className="animate-slide-up space-y-8">
                            <PrayerTimesSection
                                prayerTimes={prayerTimes}
                                location={location}
                                t={t}
                                language={language}
                                prayerChecklist={prayerChecklist}
                                onTogglePrayer={handleTogglePrayer}
                            />
                        </div>
                    )}

                    {activeTab === "custom" && (
                        <CustomDuasSection
                            customDuas={customDuas}
                            newDua={newDua}
                            setNewDua={setNewDua}
                            addCustomDua={addCustomDua}
                            deleteCustomDua={deleteCustomDua}
                            t={t}
                        />
                    )}

                    {activeTab === "settings" && (
                        <SettingsSection
                            t={t}
                            userProfile={userProfile}
                            logout={logout}
                            language={language}
                            setLanguage={setLanguage}
                            isDarkMode={isDarkMode}
                            toggleDarkMode={() => setIsDarkMode((d) => !d)}
                            location={location}
                            setLocation={setLocation}
                            resetAllProgress={resetAllProgress}
                            deferredPrompt={deferredPrompt}
                            installPWA={() => deferredPrompt?.prompt()}
                            updateProfile={updateUserProfile}
                            arabicFontSize={arabicFontSize}
                            setArabicFontSize={setArabicFontSize}
                            showEnTranslations={showEnTranslations}
                            setShowEnTranslations={setShowEnTranslations}
                            accentColor={accentColor}
                            setAccentColor={setAccentColor}
                            enablePrayerNotifications={enablePrayerNotifications}
                            setEnablePrayerNotifications={setEnablePrayerNotifications}
                            enableAzkarNotifications={enableAzkarNotifications}
                            setEnableAzkarNotifications={setEnableAzkarNotifications}
                            notificationSound={notificationSound}
                            setNotificationSound={setNotificationSound}
                        />
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className="py-12 text-center bg-[var(--bg-surface)] border-t border-glass-border">
                <p className="text-[var(--primary)] font-black mb-4 tracking-wide text-[10px] uppercase">{t.appName} — {t.appTagline}</p>
                <h2 className="text-xl font-amiri text-text-primary px-6 mb-6 italic leading-relaxed">"أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ"</h2>
                <div className="flex items-center justify-center gap-4 opacity-30">
                    <div className="w-10 h-px bg-current" />
                    <BookOpen className="w-5 h-5 text-[var(--primary)]" />
                    <div className="w-10 h-px bg-current" />
                </div>
            </footer>

            {/* Persistent Progress Bar (Global Floating) */}
            {DAILY_TAB_IDS.includes(activeTab) && (
                <div className="fixed bottom-[75px] md:bottom-8 left-0 right-0 z-40 px-4 pointer-events-none">
                    <div className="max-w-md mx-auto glass-panel p-2 shadow-xl border border-[var(--primary)]/20 pointer-events-auto overflow-hidden animate-slide-up bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
                        <div className="flex items-center justify-between mb-1.5 px-2">
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${progressPercentage === 100 ? 'bg-emerald-500 animate-pulse' : 'bg-[var(--primary)]'}`} />
                                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-primary)]">
                                    {tabs.find(t => t.id === activeTab)?.labelText}
                                </span>
                            </div>
                            <span className="text-[10px] font-black text-[var(--text-secondary)] bg-[var(--bg-subtle)] px-2 py-0.5 rounded-full">
                                {completedCount} / {currentAzkarList.length} {t.doneLabel}
                            </span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100/50 dark:bg-slate-800/50 rounded-full overflow-hidden border border-black/5">
                            <div 
                                className="h-full bg-gradient-to-r from-[var(--primary)] via-[var(--primary-light)] to-[var(--primary)] bg-[length:200%_100%] animate-shimmer rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(var(--primary-rgb),0.4)]" 
                                style={{ width: `${progressPercentage}%` }} 
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Bottom navigation */}
            <nav className="bottom-nav border-t border-glass-border" aria-label={t.navLabel}>
                {tabs.map((tab) => {
                    const prog = tabProgress[tab.id];
                    return (
                        <button
                            key={tab.id}
                            onClick={() => handleTabChange(tab.id)}
                            className={`bottom-nav-item ${activeTab === tab.id ? 'active' : ''}`}
                        >
                            <div className="relative">
                                <tab.icon className={`w-5 h-5 mb-1 ${prog?.isAllDone ? 'text-emerald-500' : ''}`} />
                                {/* numeric badge removed for cleaner menu */}
                            </div>
                            <span className="text-[10px] font-bold">{tab.labelText}</span>
                        </button>
                    );
                })}
            </nav>
        </div>
    );
};

export default React.memo(AzkarApp);
