import React from 'react';
import { CheckCircle, Zap, Flame } from 'lucide-react';

const StreakBanner = ({ streakCount, goals, t }) => (
    <div className="glass-panel p-3 space-y-3">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-[var(--primary)]" />
                <h3 className="text-base font-black text-text-primary">{t.streakTitle}</h3>
            </div>
            <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-[var(--primary)]" />
                <span className="text-lg font-black text-[var(--primary)]">{streakCount}</span>
                <span className="text-[9px] font-black uppercase text-text-secondary">{t.streakDays}</span>
            </div>
        </div>

        {goals && goals.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
                {goals.map((goal) => (
                    <div
                        key={goal.id}
                        className={`px-2 py-1 rounded-md text-[10px] font-black flex items-center gap-1 transition-all ${
                            goal.completed
                                ? "bg-[var(--primary)] text-white"
                                : "bg-[var(--bg-subtle)] text-text-secondary"
                        }`}
                    >
                        <CheckCircle className="w-3 h-3" />
                        <span className="truncate">{goal.label}</span>
                    </div>
                ))}
            </div>
        )}
    </div>
);

export default StreakBanner;
