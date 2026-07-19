import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Clock, Moon, Sun, BookOpen, Settings } from 'lucide-react';
import {
    ICONS, DAILY_TAB_IDS, OFFLINE_PRAYER_TIMES,
    PRAYER_CHECKLIST, I18N, azkar, defaultCustomDuas, tabConfig,
    PRAYER_BANNERS, ACCENT_OPTIONS
} from '../utils/constants';
import {
    showToast, readJson, readDailyState, writeJson, readUsers, writeUsers, findUserByEmail, getUserStorageSuffix, isSameDay, isYesterday, hashString,
    parsePrayerTime, formatPrayerTime
} from '../utils/helpers';

import ToastContainer   from './ToastContainer';
import ScrollToTop      from './ScrollToTop';
import OfflineBanner    from './OfflineBanner';
import PrayerTimesSection from './PrayerTimesSection';
import CustomDuasSection  from './CustomDuasSection';
import SettingsSection    from './SettingsSection';
import StreakBanner        from './StreakBanner';
import ProgressHero        from './ProgressHero';
import LoginScreen         from './LoginScreen';
import WelcomeScreen       from './WelcomeScreen';
import NotificationProvider from './NotificationProvider';
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

// Map tab IDs to azkar data keys
const TAB_TO_AZKAR_KEY = {
    morning: "morning",
    evening: "evening",
    sleeping: "sleeping",
    prayer_azkar: "prayerAzkar",
    jawami: "jawami"
};

// ═══════════════════════════════════════════════
// AzkarApp — Root Component
//
// HOOK ORDERING RULES (prevents TDZ crash):
//   1. All useState declarations first
//   2. All useMemo / useCallback that derive from state
//   3. All useEffect hooks last
// ═══════════════════════════════════════════════

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

    const [prayerTimes, setPrayerTimes]   = useState(null);
    const [hijriDate, setHijriDate]      = useState(null);
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
    const [showWelcome, setShowWelcome]           = useState(() => {
        const seen = localStorage.getItem("azkar_welcomeSeen");
        return seen !== "true";
    });

    // Refs
    const completedAzkarRef = useRef(completedAzkar);
    const azkarProgressRef  = useRef(azkarProgress);
    const toastShownRef     = useRef(new Set());

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
    }, [activeTab, azkar]);

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

    const formatHijriDate = useCallback(() => {
        if (!hijriDate) return "";
        const day = hijriDate.day || "";
        const month = hijriDate.month?.ar || hijriDate.month?.en || "";
        const year = hijriDate.year || "";
        return language === 'en' ? `${month} ${day}, ${year}` : `${day} ${month} ${year}`;
    }, [hijriDate, language]);

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
            if (data.code === 200) { 
                setPrayerTimes(data.data.timings); 
                setHijriDate(data.data.date.hijri);
                return; 
            }
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
    }, [prayerTimes, currentTime]);

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
        return formatPrayerTime(date, language);
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
        if (!sectionComplete) {
            scrollToNextZikr(id, list, type);
        }
    }, [scrollToNextZikr]);

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
        // Clear any in-progress highlight / counter animation from the
        // previous tab so they don't bleed into the newly-mounted content.
        setHighlightedZikr(null);
        setNextFocusZikr(null);
        setCountAnimation(null);
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

    const resetWelcome = useCallback(() => {
        localStorage.removeItem("azkar_welcomeSeen");
        setShowWelcome(true);
        showToast(language === "en" ? "Welcome screen will show on next visit" : "سيتم إظهار شاشة الترحيب في المرة القادمة", "info");
    }, [language]);

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
                // Gentle scroll only if card is out of view
                const el = document.getElementById(`zikr-${nextFocusZikr}`);
                if (el && !isElementInViewport(el)) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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
        const root = document.documentElement;
        // Set data-theme attribute to apply the theme CSS variables
        root.setAttribute('data-theme', accentColor);
        // Also set inline styles for accent colors (not covered by data-theme)
        const style = getAccentStyle();
        const currentVars = isDarkMode && style.darkVars ? style.darkVars : style.vars;
        root.style.setProperty('--primary', currentVars['--primary']);
        root.style.setProperty('--primary-light', currentVars['--primary-light']);
        root.style.setProperty('--primary-dark', currentVars['--primary-dark']);
        root.style.setProperty('--primary-rgb', currentVars['--primary-rgb']);
        root.style.setProperty('--accent', currentVars['--accent']);
        root.style.setProperty('--accent-light', currentVars['--accent-light']);
        root.style.setProperty('--accent-dark', currentVars['--accent-dark']);
        root.style.setProperty('--accent-rgb', hexToRgb(currentVars['--accent']));
        root.style.setProperty('--accent-glow', `rgba(${hexToRgb(currentVars['--accent'])}, 0.25)`);
        localStorage.setItem("azkar_accentColor", accentColor);
    }, [accentColor, getAccentStyle, hexToRgb, isDarkMode]);


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
    // Show welcome screen for first-time visitors
    if (showWelcome) {
        return (
            <WelcomeScreen
                onGetStarted={() => {
                    localStorage.setItem("azkar_welcomeSeen", "true");
                    setShowWelcome(false);
                }}
                onSignIn={() => {
                    localStorage.setItem("azkar_welcomeSeen", "true");
                    setShowWelcome(false);
                }}
                language={language}
            />
        );
    }

    if (!isLoggedIn) {
        return <LoginScreen
            onLogin={handleLogin}
            onSelectExistingUser={handleSelectExistingUser}
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
                        <div className="w-10 h-10 rounded-lg bg-[var(--bg-surface)] flex items-center justify-center shadow-sm border border-[var(--glass-border)] transition-transform">
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
                            {hijriDate && (
                                <span className="text-xs text-[var(--text-secondary)] font-medium border-l border-glass-border pl-2 ml-1">
                                    {formatHijriDate()}
                                </span>
                            )}
                        </div>
                        <button onClick={() => setIsDarkMode((d) => !d)} className="p-2.5 rounded-lg bg-bg-surface text-text-secondary border border-glass-border hover:text-[var(--primary)]">
                            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                        <button onClick={() => handleTabChange("settings")} className={`p-2.5 rounded-lg border transition-all ${activeTab === "settings" ? "bg-primary text-white border-primary" : "bg-bg-surface text-text-secondary border-glass-border hover:text-primary"}`}>
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
                                    className={`desktop-nav-item relative ${activeTab === tab.id ? 'active' : ''} ${prog?.isAllDone ? 'border-[var(--success)]/30' : ''}`}
                                >
                                    <tab.icon className={`w-4 h-4 ${prog?.isAllDone ? 'text-[var(--success)]' : ''}`} />
                                    <span>{tab.labelText}</span>
                                </button>
                            );
                        })}
                    </div>
                </nav>
            </header>

            {nextPrayer && (
                <section className="container mx-auto px-4 py-3 max-w-3xl">
                    <div className="glass-panel rounded-2xl p-4">
                        <div className="flex flex-col sm:flex-row items-center gap-3">
                            <div className="flex items-center justify-center flex-shrink-0 w-14 h-14 rounded-xl bg-primary/15 text-primary shadow-sm text-xl">
                                {nextPrayer.icon}
                            </div>
                            <div className="flex-1 min-w-0 text-center sm:text-left">
                                <span className="inline-flex items-center justify-center rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-primary">
                                    {language === 'en' ? 'Next prayer' : 'الصلاة القادمة'}
                                </span>
                                <h2 className="mt-2 text-lg font-black text-[var(--text-primary)] leading-snug truncate">
                                    {language === 'en' ? nextPrayer.en : nextPrayer.ar}
                                </h2>
                                <p className="mt-1 text-xl font-black text-primary leading-none" dir="ltr">
                                    {formatNextPrayerTime(nextPrayer.date)}
                                </p>
                                {nextPrayerCountdown && (
                                    <p className="mt-1.5 text-sm text-[var(--text-secondary)]">
                                        {language === 'en' ? 'In ' : 'بعد '}<span className="font-black text-[var(--text-primary)]">{nextPrayerCountdown}</span>
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Main content */}
            <main className="container mx-auto px-4 py-5 max-w-3xl space-y-5">
                <StreakBanner streakCount={streak.count} goals={goals} t={t} />

                <ProgressHero
                    activeTab={activeTab}
                    progressPercentage={progressPercentage}
                    completedCount={completedCount}
                    totalCount={currentAzkarList.length}
                    resetAllProgress={resetAllProgress}
                    t={t}
                    userProfile={userProfile}
                    language={language}
                />

                <div key={activeTab} className="space-y-5">
                    {activeTab === "morning"       && renderAzkarList(azkar.morning, "morning")}
                    {activeTab === "evening"       && renderAzkarList(azkar.evening, "evening")}
                    {activeTab === "sleeping"      && renderAzkarList(azkar.sleeping, "sleeping")}
                    {activeTab === "prayer_azkar"  && renderAzkarList(azkar.prayerAzkar, "prayer_azkar")}
                    {activeTab === "jawami"        && renderAzkarList(azkar.jawami, "jawami")}

                    {activeTab === "prayer" && (
                        <div className="space-y-6">
                            <PrayerTimesSection
                                prayerTimes={prayerTimes}
                                hijriDate={hijriDate}
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
                            resetWelcome={resetWelcome}
                            notificationSettings={readJson("azkar_notificationSettings", { prayerReminders: true, azkarReminders: true })}
                            notificationPermission={typeof Notification !== 'undefined' ? Notification.permission : 'default'}
                            requestNotificationPermission={async () => {
                                if (!('Notification' in window)) return;
                                const result = await Notification.requestPermission();
                                if (result === 'granted') {
                                    showToast(language === 'en' ? 'Notifications enabled!' : 'تم تفعيل الإشعارات!', 'success');
                                }
                            }}
                            updateNotificationSettings={(newSettings) => {
                                writeJson("azkar_notificationSettings", { ...readJson("azkar_notificationSettings", {}), ...newSettings });
                            }}
                        />
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className="py-12 text-center bg-[var(--bg-surface)] border-t border-glass-border">
                <p className="text-[var(--primary)] font-black mb-4 tracking-wide text-[10px] uppercase">{t.appName} — {t.appTagline}</p>
                <h2 className="text-2xl md:text-3xl font-amiri text-[var(--primary)] px-6 mb-6 leading-relaxed font-bold">أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ</h2>
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
                                <div className={`w-2 h-2 rounded-full ${progressPercentage === 100 ? 'bg-[var(--success)] animate-pulse' : 'bg-[var(--primary)]'}`} />
                                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-primary)]">
                                    {tabs.find(t => t.id === activeTab)?.labelText}
                                </span>
                            </div>
                            <span className="text-[10px] font-black text-[var(--text-secondary)]">
                                {completedCount} / {currentAzkarList.length} {t.doneLabel}
                            </span>
                        </div>
                        <div className="h-1.5 w-full bg-[var(--bg-subtle)] rounded-full overflow-hidden border border-black/5">
                            <div 
                                className="h-full bg-[var(--primary)] rounded-full transition-all duration-500 ease-out" 
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
                                <tab.icon className={`w-5 h-5 mb-1 ${prog?.isAllDone ? 'text-[var(--success)]' : ''}`} />
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