import React from 'react';
import { Sun, Moon, BookOpen, Heart, Clock, ShieldCheck, Zap, ArrowRight } from 'lucide-react';
import Logo from './Logo';

const FEATURES = [
    {
        icon: Sun,
        title_ar: "أذكار الصباح والمساء",
        title_en: "Morning & Evening Azkar",
        desc_ar: "مجموعة موثوقة من الأذكار اليومية مع عدادات تتبع التقدم",
        desc_en: "Trusted daily invocations with progress tracking counters"
    },
    {
        icon: Clock,
        title_ar: "مواقيت الصلاة",
        title_en: "Prayer Times",
        desc_ar: "جلب أوقات الصلاة الدقيقة مع عد تنازلي للصلاة القادمة",
        desc_en: "Accurate prayer times with countdown to next prayer"
    },
    {
        icon: Zap,
        title_ar: "سلسلة الإنجاز",
        title_en: "Streak Tracking",
        desc_ar: "نظام تحفيزي لتتبع التزامك اليومي وحفظ استمراريتك",
        desc_en: "Motivational system to track your daily commitment"
    },
    {
        icon: BookOpen,
        title_ar: "أذكار بعد الصلاة",
        title_en: "After Prayer Azkar",
        desc_ar: "أذكار مخصصة للذكر بعد أنفاس الصلوات الخمس",
        desc_en: "Invocations specifically for after the five daily prayers"
    },
    {
        icon: Heart,
        title_ar: "أدعيتي الخاصة",
        title_en: "My Personal Duas",
        desc_ar: "احفظ أدعيتك المفضلة واحتفظ بها في مكان واحد",
        desc_en: "Save your favorite supplications in one place"
    },
    {
        icon: ShieldCheck,
        title_ar: "يعمل بدون إنترنت",
        title_en: "Works Offline",
        desc_ar: "يمكنك تثبيت التطبيق واستخدامه في أي وقت دون اتصال",
        desc_en: "Install as PWA and use anywhere, anytime"
    }
];

const WelcomeScreen = ({ onGetStarted, onSignIn, language }) => {
    const isEn = language === "en";
    
    return (
        <div className="min-h-screen flex flex-col bg-[var(--bg-main)] pattern-bg" dir={isEn ? "ltr" : "rtl"}>
            {/* Hero Section */}
            <div className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-md animate-scale-in">
                    <div className="glass-panel p-8 space-y-8 text-center">
                        {/* Logo */}
                        <div className="w-24 h-24 mx-auto bg-white dark:bg-[var(--bg-subtle)] rounded-2xl shadow-sm flex items-center justify-center border border-[var(--glass-border)]">
                            <Logo className="w-20 h-20 rounded-xl" />
                        </div>
                        
                        {/* App Name & Tagline */}
                        <div className="space-y-2">
                            <h1 className="text-4xl font-black text-[var(--text-primary)]">
                                {isEn ? "Hesnok" : "حصنك"}
                            </h1>
                            <p className="text-sm font-bold text-[var(--text-secondary)]">
                                {isEn ? "Your daily spiritual companion" : "الحِصن المنيع للمسلم"}
                            </p>
                        </div>

                        {/* Features Grid */}
                        <div className="grid grid-cols-2 gap-3">
                            {FEATURES.map((feature, index) => {
                                const Icon = feature.icon;
                                return (
                                    <div 
                                        key={index}
                                        className="p-4 rounded-xl bg-[var(--bg-subtle)] border border-[var(--glass-border)] transition-all hover:scale-105"
                                        style={{ animationDelay: `${index * 50}ms` }}
                                    >
                                        <Icon className="w-8 h-8 mx-auto mb-2 text-[var(--primary)]" />
                                        <h3 className="text-xs font-black text-[var(--text-primary)] mb-1">
                                            {isEn ? feature.title_en : feature.title_ar}
                                        </h3>
                                        <p className="text-[10px] text-[var(--text-secondary)] leading-tight">
                                            {isEn ? feature.desc_en : feature.desc_ar}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3 pt-4">
                            <button
                                onClick={onGetStarted}
                                className="w-full py-4 rounded-xl bg-[var(--primary)] text-white font-black text-base flex items-center justify-center gap-2 hover:bg-[var(--primary-dark)] transition-all active:scale-95"
                            >
                                <span>{isEn ? "Get Started" : "ابدأ الآن"}</span>
                                <ArrowRight className={`w-5 h-5 ${isEn ? 'group-hover:translate-x-1' : 'group-hover:-translate-x-1 rtl-flip'}`} />
                            </button>
                            
                            <button
                                onClick={onSignIn}
                                className="w-full py-3 rounded-xl bg-[var(--bg-subtle)] text-[var(--text-primary)] font-bold text-sm border border-[var(--glass-border)] hover:border-[var(--primary)] transition-all"
                            >
                                {isEn ? "Sign In" : "تسجيل الدخول"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="py-6 text-center">
                <p className="text-[10px] font-black uppercase tracking-wide text-[var(--text-secondary)]">
                    {isEn ? "حصنك — Your fortress of faith" : "حصنك — دليلك اليومي للأذكار والصلاة"}
                </p>
            </footer>
        </div>
    );
};

export default WelcomeScreen;