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
    prayer_azkar: {
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
        prayer_azkar: t.progressTitlePrayer,
        jawami: t.jawamiTitle
    }[activeTab];

    return (
        <div className="progress-hero relative animate-scale-in">
            <div className="relative z-10 flex flex-col gap-5">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black tracking-wide bg-[var(--bg-subtle)] border border-[var(--glass-border)] text-[var(--text-secondary)]">
                            <Icon className="w-3.5 h-3.5 text-[var(--primary)]" />
                            {userProfile?.name
                                ? (language === "en" ? `Goals for ${userProfile.name}` : `أهداف ${userProfile.name}`)
                                : t.goalsTitle}
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black text-[var(--text-primary)] leading-tight">{label}</h2>
                        <p className="text-sm font-bold text-[var(--text-secondary)]">
                            {t.progressText}{" "}
                            <span className="font-black text-[var(--primary)]">{completedCount}</span>{" "}
                            {t.progressOf}{" "}
                            <span className="font-black text-[var(--text-primary)]">{totalCount}</span>{" "}
                            {t.progressAzkar}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="bg-[var(--bg-subtle)] px-5 py-3 rounded-lg border border-[var(--glass-border)] flex flex-col items-center">
                            <span className="text-2xl font-black text-[var(--primary)]">{progressPercentage}%</span>
                            <span className="text-[10px] font-black uppercase tracking-wide text-[var(--text-secondary)]">{t.progressLabel}</span>
                        </div>
                        {progressPercentage > 0 && (
                            <button
                                onClick={resetAllProgress}
                                className="p-3 rounded-lg bg-[var(--bg-subtle)] hover:bg-white dark:hover:bg-[var(--bg-surface)] border border-[var(--glass-border)] text-[var(--text-secondary)] transition-all active:scale-95"
                                aria-label={t.resetProgress}
                            >
                                <RotateCcw className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Progress bar */}
                <div className="h-3 w-full bg-[var(--bg-subtle)] rounded-full overflow-hidden border border-[var(--glass-border)] relative">
                    <div
                        className="h-full bg-gradient-to-r from-[var(--primary)] via-[var(--primary-light)] to-[var(--primary)] bg-[length:200%_100%] animate-shimmer transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]"
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>
            </div>
        </div>
    );
};

export default ProgressHero;
