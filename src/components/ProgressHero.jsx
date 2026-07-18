import React from 'react';
import { Sun, Moon, BookOpen, Heart, RotateCcw } from 'lucide-react';
import { DAILY_TAB_IDS } from '../utils/constants';

const THEMES = {
    morning: {
        icon: Sun
    },
    evening: {
        icon: Moon
    },
    sleeping: {
        icon: Moon
    },
    prayerAzkar: {
        icon: BookOpen
    },
    jawami: {
        icon: Heart
    }
};

const ProgressHero = ({ activeTab, progressPercentage, completedCount, totalCount, resetAllProgress, t, userProfile, language }) => {
    if (!DAILY_TAB_IDS.includes(activeTab)) return null;

    const theme = THEMES[activeTab];
    if (!theme) return null;

    const Icon = theme.icon;
    const label = {
        morning: t.progressTitleMorning,
        evening: t.progressTitleEvening,
        sleeping: t.progressTitleSleeping,
        prayerAzkar: t.progressTitlePrayer,
        jawami: t.jawamiTitle
    }[activeTab];

    return (
        <div className="progress-hero relative animate-scale-in">
            <div className="relative z-10 flex flex-col gap-3">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                    <div className="space-y-1">
                        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg text-[10px] font-black tracking-wide bg-[var(--bg-subtle)] border border-[var(--glass-border)] text-[var(--text-secondary)]">
                            <Icon className="w-3 h-3 text-[var(--primary)]" />
                            {userProfile?.name
                                ? (language === "en" ? `Goals for ${userProfile.name}` : `أهداف ${userProfile.name}`)
                                : t.goalsTitle}
                        </div>
                        <h2 className="text-lg md:text-xl font-black text-[var(--text-primary)] leading-tight">{label}</h2>
                        <p className="text-xs font-bold text-[var(--text-secondary)]">
                            {t.progressText}{" "}
                            <span className="font-black text-[var(--primary)]">{completedCount}</span>{" "}
                            {t.progressOf}{" "}
                            <span className="font-black text-[var(--text-primary)]">{totalCount}</span>{" "}
                            {t.progressAzkar}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="bg-[var(--bg-subtle)] px-3 py-2 rounded-lg border border-[var(--glass-border)] flex flex-col items-center">
                            <span className="text-lg font-black text-[var(--primary)]">{progressPercentage}%</span>
                            <span className="text-[9px] font-black uppercase tracking-wide text-[var(--text-secondary)]">{t.progressLabel}</span>
                        </div>
                        {progressPercentage > 0 && (
                            <button
                                onClick={resetAllProgress}
                                className="p-2 rounded-lg bg-[var(--bg-subtle)] hover:bg-white dark:hover:bg-[var(--bg-surface)] border border-[var(--glass-border)] text-[var(--text-secondary)] transition-all active:scale-95"
                                aria-label={t.resetProgress}
                            >
                                <RotateCcw className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Progress bar */}
                <div className="h-2 w-full bg-[var(--bg-subtle)] rounded-full overflow-hidden border border-[var(--glass-border)] relative">
                    <div
                        className="h-full bg-gradient-to-r from-[var(--primary)] via-[var(--primary-light)] to-[var(--primary)] bg-[length:200%_100%] animate-shimmer transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(var(--primary-rgb),0.3)]"
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>
            </div>
        </div>
    );
};

export default ProgressHero;
