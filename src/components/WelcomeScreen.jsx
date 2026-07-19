import React from 'react';
import { Sun, Moon, BookOpen, Heart, Clock, ShieldCheck, Zap, ArrowRight } from 'lucide-react';
import Logo from './Logo';

// Simplified features - icons inline for immediate display
const FEATURES = [
    { icon: Sun, title_ar: "أذكار الصباح والمساء", title_en: "Morning & Evening Azkar" },
    { icon: Clock, title_ar: "مواقيت الصلاة", title_en: "Prayer Times" },
    { icon: Zap, title_ar: "سلسلة الإنجاز", title_en: "Streak Tracking" },
    { icon: BookOpen, title_ar: "أذكار بعد الصلاة", title_en: "After Prayer Azkar" },
    { icon: Heart, title_ar: "أدعيتي الخاصة", title_en: "My Personal Duas" },
    { icon: ShieldCheck, title_ar: "يعمل بدون إنترنت", title_en: "Works Offline" }
];

const WelcomeScreen = ({ onGetStarted, onSignIn, language }) => {
    const isEn = language === "en";
    
    return (
        <div className="min-h-screen flex flex-col bg-[var(--bg-main)] pattern-bg" dir={isEn ? "ltr" : "rtl"}>
            {/* Hero Section - optimized for fast render */}
            <div className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="glass-panel p-6 space-y-6 text-center">
                        {/* Logo */}
                        <div className="w-20 h-20 mx-auto bg-white dark:bg-[var(--bg-subtle)] rounded-xl shadow-sm flex items-center justify-center border border-[var(--glass-border)]">
                            <Logo className="w-16 h-16 rounded-lg" />
                        </div>
                        
                        {/* App Name & Tagline */}
                        <div className="space-y-1">
                            <h1 className="text-3xl font-black text-[var(--text-primary)]">
                                {isEn ? "Hesnok" : "حصنك"}
                            </h1>
                            <p className="text-xs font-bold text-[var(--text-secondary)]">
                                {isEn ? "Your daily spiritual companion" : "الحِصن المنيع للمسلم"}
                            </p>
                        </div>

                        {/* Features Grid - simplified */}
                        <div className="grid grid-cols-3 gap-2">
                            {FEATURES.map((feature, index) => {
                                const Icon = feature.icon;
                                return (
                                    <div 
                                        key={index}
                                        className="p-2 rounded-lg bg-[var(--bg-subtle)] border border-[var(--glass-border)]"
                                    >
                                        <Icon className="w-5 h-5 mx-auto mb-1 text-[var(--primary)]" />
                                        <h3 className="text-[10px] font-black text-[var(--text-primary)]">
                                            {isEn ? feature.title_en : feature.title_ar}
                                        </h3>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-2 pt-2">
                            <button
                                onClick={onGetStarted}
                                className="w-full py-3 rounded-xl bg-[var(--primary)] text-white font-black text-sm flex items-center justify-center gap-2"
                            >
                                <span>{isEn ? "Get Started" : "ابدأ الآن"}</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                            
                            <button
                                onClick={onSignIn}
                                className="w-full py-2.5 rounded-xl bg-[var(--bg-subtle)] text-[var(--text-primary)] font-bold text-xs border border-[var(--glass-border)]"
                            >
                                {isEn ? "Sign In" : "تسجيل الدخول"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="py-4 text-center">
                <p className="text-[9px] font-black uppercase tracking-wide text-[var(--text-secondary)]">
                    {isEn ? "حصنك — Your fortress of faith" : "حصنك — دليلك اليومي للأذكار والصلاة"}
                </p>
            </footer>
        </div>
    );
};

export default WelcomeScreen;