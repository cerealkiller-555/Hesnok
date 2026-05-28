import React from 'react';

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

const PRAYER_CARDS = [
    { name_ar: "الفجر",  name_en: "Fajr",    key: "Fajr",    icon: "🌅" },
    { name_ar: "الشروق", name_en: "Sunrise",  key: "Sunrise",  icon: "☀️" },
    { name_ar: "الظهر",  name_en: "Dhuhr",    key: "Dhuhr",    icon: "🌞" },
    { name_ar: "العصر",  name_en: "Asr",      key: "Asr",      icon: "🌤️" },
    { name_ar: "المغرب", name_en: "Maghrib",  key: "Maghrib",  icon: "🌆" },
    { name_ar: "العشاء", name_en: "Isha",     key: "Isha",     icon: "🌙" }
];

const PrayerTimesSection = ({ prayerTimes, location, t, language, prayerChecklist, onTogglePrayer }) => (
    <div className="animate-slide-up">
        <div className="mb-5 text-center">
            <h2 className="text-2xl font-black text-[var(--text-primary)] mb-2">{t.prayerTimesTitle}</h2>
            <p className="text-sm text-[var(--text-secondary)] font-medium">
                {location.city} — {new Date().toLocaleDateString(language === "en" ? "en-US" : "ar-EG", {
                    weekday: "long", year: "numeric", month: "long", day: "numeric"
                })}
            </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {prayerTimes ? PRAYER_CARDS.map((p) => {
                const prayerId = p.key.toLowerCase();
                const isMarkable = prayerId !== 'sunrise';
                const checked = Boolean(prayerChecklist?.[prayerId]);
                return (
                    <div key={p.key} className="prayer-time-card group cursor-default rounded-3xl border border-[var(--glass-border)] bg-[var(--bg-surface)] p-5 shadow-sm transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <span className="prayer-time-icon text-xl transition-transform duration-300 group-hover:scale-105">{p.icon}</span>
                            <div className="w-2 h-2 rounded-full bg-[var(--primary)] opacity-60" />
                        </div>
                        <h3 className="text-sm md:text-base font-bold mb-1 text-[var(--text-secondary)]">
                            {language === "en" ? p.name_en : p.name_ar}
                        </h3>
                        <p className="text-xl md:text-2xl font-black text-[var(--text-primary)]" dir="ltr">
                            {formatPrayerTime(prayerTimes[p.key], language)}
                        </p>
                        {isMarkable && (
                            <button
                                type="button"
                                onClick={() => onTogglePrayer(prayerId)}
                                className={`mt-4 w-full rounded-full px-4 py-3 text-sm font-black transition-all ${checked ? 'bg-[var(--primary)] text-white' : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)] border border-[var(--glass-border)] hover:border-[var(--primary)] hover:text-[var(--primary)]'}`}
                            >
                                {checked ? t.doneLabel : t.markPrayer}
                            </button>
                        )}
                    </div>
                );
            }) : (
                <div className="col-span-full py-16 text-center">
                    <div className="inline-block w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-[var(--text-secondary)] font-bold">{t.prayerTimesLoading}</p>
                </div>
            )}
        </div>
    </div>
);

export default PrayerTimesSection;
