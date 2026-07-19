import React, { useEffect, useState, useRef, useCallback, memo } from 'react';
import { Share2, CheckCircle, Info, ChevronDown, BookOpen } from 'lucide-react';
import { showToast } from '../utils/helpers';

const ZikrCard = memo(({
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
    const cardRef = useRef(null);

    const isEn = language === "en" || showEnTranslations;
    const title   = isEn && zikr.titleEn   ? zikr.titleEn   : zikr.title;
    const benefit = isEn && zikr.benefitEn  ? zikr.benefitEn  : zikr.benefit;
    const meaning = isEn && zikr.meaningEn  ? zikr.meaningEn  : zikr.meaning;
    const source  = isEn && zikr.sourceEn   ? zikr.sourceEn   : zikr.source;

    // Celebration flash when completed via counter (not toggle)
    useEffect(() => {
        if (isCompleted && progress >= zikr.count) {
            setShowCelebration(true);
            const timer = setTimeout(() => setShowCelebration(false), 1500);
            return () => clearTimeout(timer);
        }
    }, [isCompleted, progress, zikr.count]);

    const handleShare = useCallback(() => {
        const shareText = `${title ? `${title}\n` : ""}${zikr.text}\n\nSent from ${t.appName}`;
        if (navigator.share) {
            navigator.share({ title: t.appName, text: shareText }).catch(() => {});
        } else {
            navigator.clipboard.writeText(shareText).then(() => showToast(t.shareCopy));
        }
    }, [title, zikr.text, t.appName, t.shareCopy]);

    return (
        <div
            id={`zikr-${uniqueId}`}
            ref={cardRef}
            className={`zikr-card ${isCompleted ? 'completed border-[rgba(var(--accent-rgb),0.25)]' : 'glass-card'} ${isHighlighted ? 'is-highlighted' : ''}`}
            style={{ animationDelay: `${Math.min(index * 30, 300)}ms` }}
        >
            {/* Celebration overlay */}
            {showCelebration && (
                <div className="absolute inset-0 z-20 pointer-events-none">
                    <div className="absolute inset-0 bg-[var(--primary)]/8 rounded-lg" />
                </div>
            )}

            <div className="flex flex-col gap-4">
                {/* Header */}
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black transition-all duration-300 ${
                            isCompleted
                                ? "bg-[var(--primary)] text-white"
                                : "bg-[var(--bg-subtle)] text-[var(--text-secondary)]"
                        }`}>
                            {index + 1}
                        </div>
                        {title && (
                            <h3 className="text-sm md:text-base font-black text-[var(--text-primary)] leading-snug truncate">{title}</h3>
                        )}
                    </div>

                    <div className="flex items-center gap-1.5">
                        <button
                            onClick={handleShare}
                            className="p-2 rounded-lg bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:text-[var(--accent)] transition-all active:scale-95"
                            aria-label={t.shareLabel}
                        >
                            <Share2 className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => onToggleComplete(uniqueId, zikr.count)}
                            disabled={isCompleted}
                            className={`px-3 py-1.5 rounded-lg transition-all active:scale-95 font-black text-xs ${
                                isCompleted
                                    ? "bg-[var(--primary)] text-white cursor-default"
                                    : "bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:text-[var(--primary)]"
                            }`}
                            aria-label={isCompleted ? t.doneLabel : t.markComplete}
                        >
                            {isCompleted ? t.doneLabel : <CheckCircle className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                {/* Arabic text */}
                <div className="relative py-1.5">
                    {(() => {
                        const parts = zikr.text.split('\n');
                        const hasPrefix = parts.length > 1;
                        const prefixLine = hasPrefix ? parts[0].trim() : null;
                        const mainText = hasPrefix ? parts.slice(1).join('\n').trim() : zikr.text;
                        return (
                            <>
                                {prefixLine && (
                                    <p
                                        className={`font-amiri text-center mb-2 transition-all duration-300 text-xs ${
                                            isCompleted
                                                ? "text-[var(--text-tertiary)] opacity-60"
                                                : "text-[var(--text-secondary)]"
                                        }`}
                                        style={{
                                            fontSize: `clamp(${0.85 * (arabicFontSize / 100)}rem, ${2 * (arabicFontSize / 100)}vw, ${1 * (arabicFontSize / 100)}rem)`,
                                            lineHeight: 1.8
                                        }}
                                    >
                                        {prefixLine}
                                    </p>
                                )}
                                <p
                                    className={`text-arabic font-amiri transition-all duration-300 ${
                                        isCompleted
                                            ? "text-[var(--text-tertiary)] opacity-80"
                                            : "text-[var(--text-primary)]"
                                    }`}
                                    style={{ fontSize: `clamp(${1.1 * (arabicFontSize / 100)}rem, ${2.5 * (arabicFontSize / 100)}vw, ${1.4 * (arabicFontSize / 100)}rem)` }}
                                >
                                    {mainText}
                                </p>
                            </>
                        );
                    })()}
                </div>

                {/* Counter button */}
                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => onProgress(uniqueId, zikr.count, list, listType)}
                        disabled={isCompleted}
                        className={`counter-btn relative group overflow-hidden transition-all active:scale-[0.97] ${
                            isCompleted
                                ? "bg-[var(--bg-subtle)] border border-[var(--glass-border)] cursor-default shadow-none"
                                : "bg-[var(--primary)] hover:bg-[var(--primary-dark)]"
                        }`}
                    >
                        {/* Progress fill */}
                        {!isCompleted && (
                            <div
                                className="progress-fill z-0"
                                style={{ width: `${progressPct}%`, background: 'rgba(255, 255, 255, 0.15)' }}
                            />
                        )}

                        <div className="relative z-10 flex items-center justify-center gap-3">
                            {isCompleted ? (
                                <div className="text-[var(--primary)] font-black">
                                    <span className="text-xs uppercase tracking-wide">{t.doneLabel}</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3 text-white">
                                    <span className={`text-2xl font-black tabular-nums transition-transform duration-200 ${isAnimating ? "scale-105" : ""}`}>
                                        {progress}
                                    </span>
                                    <div className="h-6 w-px bg-[var(--accent)]/35 rounded-full" />
                                    <div className="flex flex-col items-start leading-none opacity-80">
                                        <span className="text-[9px] font-black uppercase tracking-wide mb-0.5">{t.requiredLabel}</span>
                                        <span className="text-sm font-black">{zikr.count}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </button>

                    {/* Metadata toggle (benefit / source / meaning) */}
                    {(benefit || source || meaning) && (
                        <div className="pt-1.5">
                            <button
                                onClick={() => onToggleBenefit(uniqueId)}
                                className="flex items-center justify-between w-full py-2 px-1 text-[10px] font-black uppercase tracking-wide text-[var(--primary)] hover:text-[var(--primary-dark)] transition-colors"
                            >
                                <div className="flex items-center gap-1.5">
                                    <Info className="w-3.5 h-3.5" />
                                    <span>{isExpanded ? t.benefitHide : t.benefitShow}</span>
                                </div>
                                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
                            </button>

                            {isExpanded && (
                                <div className="mt-2 space-y-2 animate-slide-up origin-top">
                                    {meaning && (
                                        <div className="p-3 rounded-lg bg-[var(--bg-subtle)] border border-[var(--glass-border)] relative overflow-hidden">
                                            <span className="block text-[9px] font-black uppercase tracking-wide text-[var(--primary)] mb-1.5">{t.meaningTitle}</span>
                                            <p className="text-xs text-[var(--text-primary)] leading-6 font-medium">{meaning}</p>
                                        </div>
                                    )}
                                     {benefit && (
                                         <div className="p-3 rounded-lg bg-[var(--primary)]/12 border border-[var(--primary)]/25">
                                             <p className="text-xs text-[var(--text-primary)] leading-6 font-medium">{benefit}</p>
                                         </div>
                                     )}
                                     {source && (
                                         <div className="flex items-center gap-1.5 px-1 text-[10px] text-[var(--primary)] font-bold">
                                             <BookOpen className="w-3.5 h-3.5" />
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
});

export default ZikrCard;