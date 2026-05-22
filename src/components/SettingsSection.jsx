import React from 'react';
import { Download, MapPin, Moon, Sun, Globe, Heart, RotateCcw, ShieldCheck } from 'lucide-react';

const SettingsSection = ({
    deferredPrompt, installPWA,
    location, setLocation,
    isDarkMode, toggleDarkMode,
    resetAllProgress,
    userProfile, updateProfile, logout,
    language, setLanguage, t,
    arabicFontSize, setArabicFontSize,
    showEnTranslations, setShowEnTranslations
}) => (
    <div className="animate-slide-up space-y-6">
        {/* PWA Install */}
        {deferredPrompt && (
            <div className="p-5 bg-[var(--bg-surface)] rounded-lg shadow-sm border border-[var(--glass-border)]">
                <h3 className="text-xl font-black text-[var(--text-primary)] mb-3 flex items-center gap-3">
                    <Download className="w-6 h-6 text-[var(--primary)]" />
                    {language === "en" ? "Install App" : "تثبيت كتطبيق"}
                </h3>
                <p className="text-[var(--text-secondary)] text-sm mb-5 font-medium leading-relaxed">
                    {language === "en"
                        ? "Install Hesnok on your device for quick access and offline use."
                        : "يمكنك تثبيت حصنك على جهازك للوصول السريع والعمل بدون إنترنت دائماً."}
                </p>
                <button onClick={installPWA} className="w-full py-3 rounded-lg bg-[var(--primary)] text-white font-black hover:bg-[var(--primary-dark)] transition-all active:scale-95">
                    {language === "en" ? "Install Now" : "تثبيت الآن"}
                </button>
            </div>
        )}

        {/* Location */}
        <div className="glass-panel p-5 space-y-5">
            <h3 className="text-xl font-black text-text-primary flex items-center gap-3">
                <MapPin className="w-5 h-5 text-[var(--primary)]" />
                {t.locationTitle}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-text-secondary uppercase tracking-wide ml-1">{t.cityLabel}</label>
                    <input
                        type="text" value={location.city}
                        onChange={(e) => setLocation({ ...location, city: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg bg-bg-subtle border border-glass-border focus:border-[var(--primary)] outline-none text-text-primary font-bold transition-all"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-text-secondary uppercase tracking-wide ml-1">{t.countryLabel}</label>
                    <input
                        type="text" value={location.country}
                        onChange={(e) => setLocation({ ...location, country: e.target.value.toUpperCase() })}
                        className="w-full px-4 py-3 rounded-lg bg-bg-subtle border border-glass-border focus:border-[var(--primary)] outline-none text-text-primary font-bold transition-all"
                    />
                </div>
            </div>
        </div>

        {/* Appearance & Language */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-panel p-5 space-y-5">
                <h3 className="text-xl font-black text-text-primary flex items-center gap-3">
                    {isDarkMode ? <Moon className="w-5 h-5 text-[var(--primary)]" /> : <Sun className="w-5 h-5 text-[var(--primary)]" />}
                    {t.appearanceTitle}
                </h3>
                <div className="space-y-4">
                    <button onClick={toggleDarkMode} className="w-full flex items-center justify-between p-4 rounded-lg bg-bg-subtle border border-glass-border hover:border-[var(--primary)] transition-all">
                        <span className="text-text-secondary font-black">{isDarkMode ? t.darkOn : t.lightOn}</span>
                        <div className={`w-12 h-7 rounded-full transition-all duration-500 flex items-center p-1 ${isDarkMode ? "bg-[var(--primary)]" : "bg-slate-300 dark:bg-slate-700"}`}>
                            <div className={`w-6 h-6 rounded-full bg-white shadow-xl transform transition-transform duration-500 ${isDarkMode ? (language === 'ar' ? '-translate-x-5' : 'translate-x-5') : 'translate-x-0'}`} />
                        </div>
                    </button>

                    <button onClick={() => setShowEnTranslations(!showEnTranslations)} className="w-full flex items-center justify-between p-4 rounded-lg bg-bg-subtle border border-glass-border hover:border-[var(--primary)] transition-all">
                        <span className="text-text-secondary font-black">{showEnTranslations ? t.showArOriginal : t.toggleEnTrans}</span>
                        <div className={`w-12 h-7 rounded-full transition-all duration-500 flex items-center p-1 ${showEnTranslations ? "bg-[var(--primary)]" : "bg-slate-300 dark:bg-slate-700"}`}>
                            <div className={`w-6 h-6 rounded-full bg-white shadow-xl transform transition-transform duration-500 ${showEnTranslations ? (language === 'ar' ? '-translate-x-5' : 'translate-x-5') : 'translate-x-0'}`} />
                        </div>
                    </button>
                </div>
            </div>

            <div className="glass-panel p-5 space-y-5">
                <h3 className="text-xl font-black text-text-primary flex items-center gap-3">
                    <Globe className="w-5 h-5 text-[var(--primary)]" />
                    {t.languageTitle}
                </h3>

                <div className="space-y-3 pb-3 border-b border-glass-border">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wide text-text-secondary">
                        <span className="text-xs">A</span>
                        <span>{arabicFontSize}%</span>
                        <span className="text-lg">A</span>
                    </div>
                    <input 
                        type="range" min="70" max="150" step="5" 
                        value={arabicFontSize} 
                        onChange={(e) => setArabicFontSize(parseInt(e.target.value))} 
                        className="w-full accent-[var(--primary)] cursor-pointer"
                    />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => setLanguage("ar")} className={`py-3 rounded-lg text-sm font-black border transition-all ${language === "ar" ? "bg-[var(--primary)] text-white border-[var(--primary)]" : "bg-bg-subtle text-text-secondary border-glass-border hover:border-[var(--primary)]"}`}>
                        العربية
                    </button>
                    <button onClick={() => setLanguage("en")} className={`py-3 rounded-lg text-sm font-black border transition-all ${language === "en" ? "bg-[var(--primary)] text-white border-[var(--primary)]" : "bg-bg-subtle text-text-secondary border-glass-border hover:border-[var(--primary)]"}`}>
                        English
                    </button>
                </div>
            </div>
        </div>

        {/* Profile */}
        <div className="glass-panel p-5 space-y-5">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-text-primary flex items-center gap-3">
                    <Heart className="w-5 h-5 text-[var(--primary)]" />
                    {t.profileTitle}
                </h3>
                <button onClick={logout} className="text-[10px] font-black uppercase tracking-wide text-text-secondary hover:text-error transition-colors px-3 py-1.5 rounded-lg bg-bg-subtle">
                    {t.logoutButton}
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-text-secondary uppercase tracking-wide ml-1">{t.nameLabel}</label>
                    <input
                        type="text" value={userProfile.name}
                        onChange={(e) => updateProfile({ ...userProfile, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg bg-bg-subtle border border-glass-border focus:border-[var(--primary)] outline-none text-text-primary font-bold"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-text-secondary uppercase tracking-wide ml-1">{t.emailLabel}</label>
                    <input type="email" value={userProfile.email} readOnly className="w-full px-4 py-3 rounded-lg bg-bg-subtle/70 border border-glass-border text-text-secondary font-bold cursor-not-allowed" />
                </div>
            </div>
        </div>

        {/* Reset */}
        <button onClick={resetAllProgress} className="w-full py-4 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-black transform active:scale-[0.98] transition-all flex items-center justify-center gap-3">
            <RotateCcw className="w-5 h-5" />
            {t.resetAllLabel}
        </button>

        {/* Trust */}
        <div className="text-center space-y-2 pt-4">
            <div className="flex items-center justify-center gap-2 text-text-secondary">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-wide">{t.profileNote}</span>
            </div>
        </div>
    </div>
);

export default SettingsSection;
