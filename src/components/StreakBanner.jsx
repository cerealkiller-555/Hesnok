import React from 'react';
import { CheckCircle, Zap } from 'lucide-react';

const StreakBanner = ({ streakCount, goals, t }) => (
    <div className="glass-panel p-5 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
                <h3 className="text-xl font-black text-text-primary leading-tight">{t.streakTitle}</h3>
                <p className="text-sm text-text-secondary font-medium leading-6">{t.streakSubtitle}</p>
            </div>
            <div className="flex items-center gap-3 bg-[var(--bg-subtle)] px-4 py-3 rounded-lg border border-[var(--glass-border)]">
                <Zap className="w-6 h-6 text-[var(--primary)]" />
                <div className="flex flex-col">
                    <span className="text-2xl font-black text-[var(--primary)] leading-none">{streakCount}</span>
                    <span className="text-[10px] font-black uppercase tracking-wide text-[var(--text-secondary)]">{t.streakDays}</span>
                </div>
            </div>
        </div>

        {goals && goals.length > 0 && (
            <div className="pt-4 border-t border-glass-border">
                <p className="text-[10px] font-black uppercase tracking-wide text-text-secondary mb-3">{t.goalsTitle}</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {goals.map((goal) => (
                        <div
                            key={goal.id}
                            className={`p-3 rounded-lg border flex items-center gap-3 text-sm font-black transition-all ${
                                goal.completed
                                    ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                                    : "bg-bg-subtle dark:bg-slate-900/50 border-glass-border text-text-secondary"
                            }`}
                        >
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                                goal.completed ? "bg-white/15 text-white" : "bg-white dark:bg-slate-800 text-text-secondary"
                            }`}>
                                <CheckCircle className="w-4 h-4" />
                            </div>
                            <span className="truncate">{goal.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        )}
    </div>
);

export default StreakBanner;
