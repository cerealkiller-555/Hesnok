import React, { useEffect, useState } from 'react';
import { Share2, CheckCircle, Info, ChevronDown, BookOpen } from 'lucide-react';
import { showToast } from '../utils/helpers';

const ZikrCard = ({
    zikr,
    index,
    uniqueId,
    t,
    isCompleted,
    progress,
    isExpanded,
    progressPct,
    isAnimating,
    isHighlighted,
    language,
    arabicFontSize = 100,
    showEnTranslations = false,
    list,
    listType,
    onToggleBenefit,
    onToggleComplete,
    onProgress
}) => {
    const [showCelebration, setShowCelebration] = useState(false);

    const isEn = language === "en" || showEnTranslations;
    const title   = isEn && zikr.titleEn   ? zikr.titleEn   : zikr.title;
    const benefit = isEn && zikr.benefitEn  ? zikr.benefitEn  : zikr.benefit;
    const meaning = isEn && zikr.meaningEn  ? zikr.meaningEn  : zikr.meaning;
    const source  = isEn && zikr.sourceEn   ? zikr.sourceEn   : zikr.source;

    // Celebration flash when completed via counter (not toggle)
    useEffect(() => {
        if (isCompleted && progress >= zikr.count) {
            setShowCelebration(true);
            const timer = setTimeout(() => setShowCelebration(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [isCompleted]); // only trigger on completion state change

    const handleShare = () => {
        const shareText = `${title ? `${title}\n` : ""}${zikr.text}\n\nSent from ${t.appName}`;
        if (navigator.share) {
            navigator.share({ title: t.appName, text: shareText }).catch(() => {});
        } else {
            navigator.clipboard.writeText(shareText).then(() => showToast(t.shareCopy));
        }
    };

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // ensure mount animation only runs once when the card enters the DOM
        setMounted(true);
    }, []);

    return (
        <div
            id={`zikr-${uniqueId}`}
            className={`zikr-card ${mounted ? 'animate-slide-up' : ''} ${isCompleted ? 'completed border-emerald-500/30' : 'glass-card'} ${isHighlighted ? 'is-highlighted' : ''}`}
            style={mounted ? { animationDelay: `${index * 50}ms` } : undefined}
        >
            {/* Celebration overlay */}
            {showCelebration && (
                <div className="absolute inset-0 z-20 pointer-events-none">
                    <div className="absolute inset-0 bg-emerald-500/10 animate-pulse rounded-lg" />
                </div>
            )}

            <div className="flex flex-col gap-5">
                {/* Header */}
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-sm font-black transition-all duration-500 ${
                            isCompleted
                                ? "bg-emerald-600 text-white"
                                : "bg-[var(--bg-subtle)] text-[var(--text-secondary)]"
                        }`}>
                            {isCompleted ? <CheckCircle className="w-5 h-5" /> : index + 1}
                        </div>
                        {title && (
                            <h3 className="text-base md:text-lg font-black text-[var(--text-primary)] leading-snug truncate">{title}</h3>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleShare}
                            className="p-2.5 rounded-lg bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:text-[var(--primary)] transition-all active:scale-95"
                            aria-label={t.shareLabel}
                        >
                            <Share2 className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => onToggleComplete(uniqueId, zikr.count)}
                            className={`p-2.5 rounded-lg transition-all active:scale-95 ${
                                isCompleted
                                    ? "bg-emerald-600 text-white"
                                    : "bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:text-[var(--primary)]"
                            }`}
                            aria-label={t.markComplete}
                        >
                            <CheckCircle className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Arabic text */}
                <div className="relative py-2">
                    <p 
                        className={`text-arabic font-amiri transition-all duration-500 ${
                            isCompleted
                                ? "text-[var(--text-tertiary)] opacity-80"
                                : "text-[var(--text-primary)]"
                        }`}
                        style={{ fontSize: `clamp(${1.25 * (arabicFontSize / 100)}rem, ${3 * (arabicFontSize / 100)}vw, ${1.75 * (arabicFontSize / 100)}rem)` }}
                    >
                        {zikr.text}
                    </p>
                </div>

                {/* Counter button */}
                <div className="flex flex-col gap-4">
                    <button
                        onClick={() => onProgress(uniqueId, zikr.count, list, listType)}
                        disabled={isCompleted}
                        className={`counter-btn relative group overflow-hidden transition-all active:scale-[0.98] ${
                            isCompleted
                                ? "bg-[var(--bg-subtle)] border border-[var(--glass-border)] cursor-default shadow-none"
                                : "bg-[var(--primary)] hover:bg-[var(--primary-dark)]"
                        }`}
                    >
                        {/* Progress fill */}
                        {!isCompleted && (
                            <div
                                className="progress-fill z-0"
                                style={{ width: `${progressPct}%`, background: 'rgba(255, 255, 255, 0.18)' }}
                            />
                        )}

                        <div className="relative z-10 flex items-center justify-center gap-4">
                            {isCompleted ? (
                                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-black">
                                    <CheckCircle className="w-5 h-5" />
                                    <span className="text-sm uppercase tracking-wide">{t.doneLabel}</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-4 text-white">
                                    <span className={`text-3xl font-black tabular-nums transition-transform duration-300 ${isAnimating ? "scale-110" : ""}`}>
                                        {progress}
                                    </span>
                                    <div className="h-8 w-px bg-white/25 rounded-full" />
                                    <div className="flex flex-col items-start leading-none opacity-80">
                                        <span className="text-[10px] font-black uppercase tracking-wide mb-1">{t.requiredLabel}</span>
                                        <span className="text-base font-black">{zikr.count}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </button>

                    {/* Metadata toggle (benefit / source / meaning) */}
                    {(benefit || source || meaning) && (
                        <div className="pt-2">
                            <button
                                onClick={() => onToggleBenefit(uniqueId)}
                                className="flex items-center justify-between w-full py-3 px-1 text-[11px] font-black uppercase tracking-wide text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    <Info className="w-4 h-4" />
                                    <span>{isExpanded ? t.benefitHide : t.benefitShow}</span>
                                </div>
                                <ChevronDown className={`w-4 h-4 transition-transform duration-500 ${isExpanded ? "rotate-180" : ""}`} />
                            </button>

                            {isExpanded && (
                                <div className="mt-3 space-y-3 animate-slide-up origin-top">
                                    {meaning && (
                                        <div className="p-4 rounded-lg bg-[var(--bg-subtle)] border border-[var(--glass-border)] relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 w-1 h-full bg-[var(--primary)] opacity-60 transition-colors" />
                                            <span className="block text-[10px] font-black uppercase tracking-wide text-[var(--primary)] mb-2">{t.meaningTitle}</span>
                                            <p className="text-sm text-[var(--text-primary)] leading-7 font-medium">{meaning}</p>
                                        </div>
                                    )}
                                    {benefit && (
                                        <div className="p-4 rounded-lg bg-[var(--bg-subtle)] border border-[var(--glass-border)]">
                                            <p className="text-sm text-[var(--text-primary)] leading-7 font-medium">{benefit}</p>
                                        </div>
                                    )}
                                    {source && (
                                        <div className="flex items-center gap-2 px-1 text-[11px] text-[var(--text-secondary)] font-bold">
                                            <BookOpen className="w-4 h-4" />
                                            <span>{source}</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default React.memo(ZikrCard);
