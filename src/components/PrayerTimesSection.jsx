import React from 'react';

const formatTime12Hour = (timeStr, language) => {
    if (!timeStr) return "00:00";
    const match = timeStr.match(/^(\d{1,2}):(\d{2})/);
    if (!match) return timeStr;
    let hour = parseInt(match[1], 10);
    const minute = match[2];
    const ampm = language === "en" ? (hour >= 12 ? 'PM' : 'AM') : (hour >= 12 ? 'م' : 'ص');
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${ampm}`;
};

const PRAYER_CARDS = [
    { name_ar: "الفجر",  name_en: "Fajr",    key: "Fajr",    icon: "🌅" },
    { name_ar: "الشروق", name_en: "Sunrise",  key: "Sunrise",  icon: "☀️" },
    { name_ar: "الظهر",  name_en: "Dhuhr",    key: "Dhuhr",    icon: "🌞" },
    { name_ar: "العصر",  name_en: "Asr",      key: "Asr",      icon: "🌤️" },
    { name_ar: "المغرب", name_en: "Maghrib",  key: "Maghrib",  icon: "🌆" },
    { name_ar: "العشاء", name_en: "Isha",     key: "Isha",     icon: "🌙" }
];

const PrayerTimesSection = ({ prayerTimes, location, t, language }) => (
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
            {prayerTimes ? PRAYER_CARDS.map((p) => (
                <div key={p.key} className="prayer-time-card group cursor-default">
                    <div className="flex items-center justify-between mb-4">
                        <span className="prayer-time-icon text-xl transition-transform duration-300 group-hover:scale-105">{p.icon}</span>
                        <div className="w-2 h-2 rounded-full bg-[var(--primary)] opacity-60" />
                    </div>
                    <h3 className="text-sm md:text-base font-bold mb-1 text-[var(--text-secondary)]">
                        {language === "en" ? p.name_en : p.name_ar}
                    </h3>
                    <p className="text-xl md:text-2xl font-black text-[var(--text-primary)]" dir="ltr">
                        {formatTime12Hour(prayerTimes[p.key], language)}
                    </p>
                </div>
            )) : (
                <div className="col-span-full py-16 text-center">
                    <div className="inline-block w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-slate-400 font-bold">{t.prayerTimesLoading}</p>
                </div>
            )}
        </div>
    </div>
);

export default PrayerTimesSection;
