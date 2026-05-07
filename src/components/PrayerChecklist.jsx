import React from 'react';
import { PRAYER_CHECKLIST } from '../utils/constants';

const PrayerChecklist = ({ checklist, onToggle, language, t }) => (
    <div className="mt-8 p-5 rounded-lg bg-[var(--bg-surface)] border border-[var(--glass-border)] shadow-sm">
        <div className="mb-4">
            <h3 className="text-xl font-black text-[var(--text-primary)]">{t.prayerChecklistTitle}</h3>
            <p className="text-sm text-[var(--text-secondary)] font-medium">{t.prayerChecklistNote}</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {PRAYER_CHECKLIST.map((prayer) => {
                const checked = Boolean(checklist[prayer.id]);
                return (
                    <button
                        key={prayer.id}
                        onClick={() => onToggle(prayer.id)}
                        className={`p-3 rounded-lg border text-sm font-bold transition-all ${
                            checked
                                ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                                : "bg-[var(--bg-subtle)] text-[var(--text-secondary)] border-[var(--glass-border)]"
                        }`}
                    >
                        {language === "en" ? prayer.en : prayer.ar}
                    </button>
                );
            })}
        </div>
    </div>
);

export default PrayerChecklist;
