import React from 'react';

const PRAYER_CARDS = [
    { name_ar: "الفجر",  name_en: "Fajr",    key: "Fajr",    icon: "🌅" },
    { name_ar: "الشروق", name_en: "Sunrise",  key: "Sunrise",  icon: "☀️" },
    { name_ar: "الظهر",  name_en: "Dhuhr",    key: "Dhuhr",    icon: "🌞" },
    { name_ar: "العصر",  name_en: "Asr",      key: "Asr",      icon: "🌤️" },
    { name_ar: "المغرب", name_en: "Maghrib",  key: "Maghrib",  icon: "🌆" },
    { name_ar: "العشاء", name_en: "Isha",     key: "Isha",     icon: "🌙" }
];

const parsePrayerTime = (timeStr) => {
    if (!timeStr || typeof timeStr !== 'string') return null;
    const [hour, minute] = timeStr.split(':').map((n) => parseInt(n, 10));
    if (Number.isNaN(hour) || Number.isNaN(minute)) return null;
    const date = new Date();
    date.setHours(hour, minute, 0, 0);
    return date;
};

const formatPrayerTime = (timeStr, language) => {
    const date = parsePrayerTime(timeStr);
    if (!date) return "--:--";
    return date.toLocaleTimeString(language === 'en' ? 'en-US' : 'ar-EG', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
};

const getActivePrayerKey = (prayerTimes) => {
    if (!prayerTimes) return null;
    const now = new Date();
    
    const parsed = PRAYER_CARDS.map(p => {
        const time = prayerTimes[p.key];
        const date = parsePrayerTime(time);
        return { key: p.key, date };
    }).filter(p => p.date);
    
    if (parsed.length === 0) return null;
    
    parsed.sort((a, b) => a.date - b.date);
    
    let activeKey = null;
    for (let i = parsed.length - 1; i >= 0; i--) {
        if (parsed[i].date <= now) {
            activeKey = parsed[i].key;
            break;
        }
    }
    
    if (!activeKey) {
        activeKey = parsed[parsed.length - 1].key;
    }
    
    return activeKey;
};

// Get the next upcoming prayer (not the currently active one)
const getNextPrayerKey = (prayerTimes) => {
    if (!prayerTimes) return null;
    const now = new Date();
    
    const parsed = PRAYER_CARDS.map(p => {
        const time = prayerTimes[p.key];
        const date = parsePrayerTime(time);
        return { key: p.key, date };
    }).filter(p => p.date);
    
    if (parsed.length === 0) return null;
    
    parsed.sort((a, b) => a.date - b.date);
    
    // Find the next prayer that hasn't occurred yet today
    for (let i = 0; i < parsed.length; i++) {
        if (parsed[i].date > now) {
            return parsed[i].key;
        }
    }
    
    // If all prayers passed, next is Fajr (first prayer tomorrow)
    return parsed.find(p => p.key === 'Fajr')?.key || null;
};

const PrayerTimesSection = ({ prayerTimes, hijriDate, location, t, language, prayerChecklist, onTogglePrayer }) => {
    const activePrayerKey = getActivePrayerKey(prayerTimes);
    const nextPrayerKey = getNextPrayerKey(prayerTimes);

    // Format Hijri date
    const formatHijriDate = (hijri) => {
        if (!hijri) return null;
        const hijriMonth = language === "en" ? hijri.month.en : hijri.month.ar;
        return `${hijri.day} ${hijriMonth} ${hijri.year}`;
    };

    return (
        <div className="animate-slide-up">
            <div className="mb-5 text-center">
                <h2 className="text-2xl font-black text-[var(--text-primary)] mb-2">{t.prayerTimesTitle}</h2>
                <p className="text-sm text-[var(--text-secondary)] font-medium">
                    {location.city} — {new Date().toLocaleDateString(language === "en" ? "en-US" : "ar-EG", {
                        weekday: "long", year: "numeric", month: "long", day: "numeric"
                    })}
                </p>
                {hijriDate && (
                    <p className="text-xs text-[var(--primary)] font-bold mt-1">
                        {formatHijriDate(hijriDate)}
                    </p>
                )}
            </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {prayerTimes ? PRAYER_CARDS.map((p) => {
                    const prayerId = p.key.toLowerCase();
                    const isMarkable = prayerId !== 'sunrise';
                    const checked = Boolean(prayerChecklist?.[prayerId]);
                    const isActive = activePrayerKey === p.key;
                    const isNext = nextPrayerKey === p.key;

                    return (
                        <div 
                            key={p.key} 
                            className={`prayer-time-card group cursor-default rounded-xl border p-4 shadow-sm transition-all relative overflow-hidden ${
                                isActive 
                                    ? 'border-primary bg-bg-surface shadow-[0_8px_24px_rgba(var(--primary-rgb),0.12)] ring-1 ring-primary/30'
                                    : isNext
                                        ? 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-900/20 shadow-[0_8px_24px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/30'
                                        : 'border-glass-border bg-bg-surface'
                            }`}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <span className="prayer-time-icon text-lg transition-transform duration-300 group-hover:scale-105">{p.icon}</span>
                                {isActive ? (
                                    <span className="inline-flex items-center justify-center rounded-full bg-primary/10 text-primary text-[9px] font-black uppercase px-2 py-0.5 tracking-wider">
                                        {language === "en" ? "Active" : "الآن"}
                                    </span>
                                ) : isNext ? (
                                    <span className="inline-flex items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[9px] font-black uppercase px-2 py-0.5 tracking-wider">
                                        {language === "en" ? "Next" : "القادمة"}
                                    </span>
                                ) : (
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary opacity-60" />
                                )}
                            </div>
                            <h3 className="text-xs md:text-sm font-bold mb-1 text-[var(--text-secondary)]">
                                {language === "en" ? p.name_en : p.name_ar}
                            </h3>
                            <p className={`text-lg md:text-xl font-black ${isNext ? 'text-emerald-600 dark:text-emerald-400' : 'text-[var(--text-primary)]'}`} dir="ltr">
                                {formatPrayerTime(prayerTimes[p.key], language)}
                            </p>
                            {isMarkable && (
                                <button
                                    type="button"
                                    onClick={() => onTogglePrayer(prayerId)}
                                    className={`mt-3 w-full rounded-full px-3 py-2 text-xs font-black transition-all ${checked ? 'bg-primary text-white' : 'bg-bg-subtle text-text-secondary border border-glass-border hover:border-primary hover:text-primary'}`}
                                >
                                    {checked ? t.doneLabel : t.markPrayer}
                                </button>
                            )}
                        </div>
                    );
                }) : (
                    <div className="col-span-full py-12 text-center">
                        <div className="inline-block w-6 h-6 border-3 border-primary border-t-transparent rounded-full animate-spin mb-3" />
                        <p className="text-[var(--text-secondary)] font-bold text-sm">{t.prayerTimesLoading}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PrayerTimesSection;