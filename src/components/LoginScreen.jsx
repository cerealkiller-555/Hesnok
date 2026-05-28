import React, { useState } from 'react';
import { User, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import Logo from './Logo';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LoginScreen = ({ onLogin, onSelectExistingUser, existingUsers = [], t, language }) => {
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [errors, setErrors] = useState({ name: false, email: false, password: false });
    const [authError, setAuthError] = useState("");
    const [mode, setMode] = useState("signin");

    const isCreateMode = mode === "create";
    const title = isCreateMode ? t.createAccountTitle : t.loginTitle;
    const subtitle = isCreateMode ? t.createAccountSubtitle : t.loginSubtitle;
    const actionLabel = isCreateMode ? t.createAccountButton : t.loginButton;

    const handleSubmit = async () => {
        const emailError = !form.email.trim() || !EMAIL_REGEX.test(form.email);
        const nameError = isCreateMode && !form.name.trim();
        const passwordError = !form.password.trim() || (isCreateMode && form.password.trim().length < 6);
        setErrors({ name: nameError, email: emailError, password: passwordError });
        setAuthError("");

        if (emailError || nameError || passwordError) return;
        const result = await onLogin(form, mode);
        if (!result.success) {
            setAuthError(result.error || (mode === "signin" ? t.userNotFound : t.userExists));
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleSubmit();
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-main pattern-bg" dir={language === "ar" ? "rtl" : "ltr"}>
            <div className="w-full max-w-sm animate-scale-in">
                <div className="glass-panel p-6 md:p-8 space-y-6 relative overflow-hidden">
                    {/* Logo */}
                    <div className="text-center space-y-3">
                        <div className="w-20 h-20 mx-auto bg-white dark:bg-[var(--bg-subtle)] rounded-xl shadow-sm flex items-center justify-center border border-[var(--glass-border)]">
                            <Logo className="w-16 h-16 rounded-lg" />
                        </div>
                        <div className="space-y-1">
                            <h1 className="text-2xl font-black text-[var(--text-primary)] leading-tight">{title}</h1>
                            <p className="text-sm text-text-secondary font-bold leading-6">{subtitle}</p>
                        </div>
                    </div>

                    {/* Saved accounts */}
                    {mode === "signin" && existingUsers.length > 0 && (
                        <div className="space-y-3 p-4 rounded-2xl bg-bg-subtle border border-glass-border">
                            <p className="text-[10px] font-black uppercase tracking-wide text-text-secondary">{t.existingAccountsTitle}</p>
                            <div className="grid gap-2">
                                {existingUsers.map((user) => (
                                    <button
                                        type="button"
                                        key={user.email}
                                        onClick={() => {
                                            setForm({ name: user.name, email: user.email, password: "" });
                                            setMode("signin");
                                            setErrors({ name: false, email: false, password: false });
                                            setAuthError("");
                                        }}
                                        className="w-full rounded-xl px-4 py-3 text-left bg-white/80 dark:bg-slate-900 border border-glass-border hover:border-[var(--primary)] transition-all"
                                    >
                                        <div className="text-sm font-black text-text-primary">{user.name}</div>
                                        <div className="text-[11px] font-bold text-text-secondary">{t.signInAs} {user.email}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    {/* Form */}
                    <div className="space-y-6">
                        <div className="space-y-4">
                            {/* Name */}
                            {isCreateMode && (
                                <div>
                                    <label className={`block text-[10px] font-black uppercase tracking-wide mb-1.5 ${errors.name ? 'text-error' : 'text-text-secondary'}`}>
                                        {t.nameLabel}
                                    </label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary group-focus-within:text-[var(--primary)] transition-colors" />
                                        <input
                                            id="login-name"
                                            type="text"
                                            className={`w-full bg-bg-subtle border py-3.5 pl-12 pr-6 rounded-lg focus:outline-none focus:border-[var(--primary)] text-text-primary transition-all font-bold ${errors.name ? 'border-error/50' : 'border-glass-border'}`}
                                            placeholder={language === "en" ? "Your name" : "الاسم الكامل"}
                                            value={form.name}
                                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                                            onKeyDown={handleKeyDown}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Email */}
                            <div>
                                <label className={`block text-[10px] font-black uppercase tracking-wide mb-1.5 ${errors.email ? 'text-error' : 'text-text-secondary'}`}>
                                    {t.emailLabel}
                                </label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary group-focus-within:text-[var(--primary)] transition-colors" />
                                    <input
                                        id="login-email"
                                        type="email"
                                        className={`w-full bg-bg-subtle border py-3.5 pl-12 pr-6 rounded-lg focus:outline-none focus:border-[var(--primary)] text-text-primary transition-all font-bold ${errors.email ? 'border-error/50' : 'border-glass-border'}`}
                                        placeholder="email@example.com"
                                        value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        onKeyDown={handleKeyDown}
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className={`block text-[10px] font-black uppercase tracking-wide mb-1.5 ${errors.password ? 'text-error' : 'text-text-secondary'}`}>
                                    {t.passwordLabel}
                                </label>
                                <div className="relative group">
                                    <input
                                        id="login-password"
                                        type="password"
                                        className={`w-full bg-bg-subtle border py-3.5 pl-4 pr-6 rounded-lg focus:outline-none focus:border-[var(--primary)] text-text-primary transition-all font-bold ${errors.password ? 'border-error/50' : 'border-glass-border'}`}
                                        placeholder={language === "en" ? "Enter password" : "اكتب كلمة المرور"}
                                        value={form.password}
                                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                                        onKeyDown={handleKeyDown}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit */}
                        {authError && (
                            <p className="text-error text-sm font-bold text-center">{authError}</p>
                        )}
                        <button
                            id="login-submit"
                            onClick={handleSubmit}
                            className="w-full bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white font-black py-3.5 rounded-lg flex items-center justify-center gap-2 transform active:scale-95 transition-all group"
                        >
                            <span>{actionLabel}</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>

                        {/* Toggle mode */}
                        <button
                            onClick={() => {
                                setMode(isCreateMode ? "signin" : "create");
                                setForm({ name: "", email: "", password: "" });
                                setErrors({ name: false, email: false, password: false });
                                setAuthError("");
                            }}
                            className="w-full text-sm font-black text-[var(--primary)] opacity-90 hover:opacity-100 transition-opacity underline-offset-4 hover:underline"
                        >
                            {isCreateMode ? t.signInInstead : t.createAccountLink}
                        </button>
                    </div>

                    {/* Trust banner */}
                    <div className="bg-[var(--bg-subtle)] border border-[var(--glass-border)] p-4 rounded-lg flex items-start gap-3">
                        <ShieldCheck className="w-5 h-5 text-[var(--primary)] shrink-0" />
                        <p className="text-[11px] text-text-primary font-bold leading-relaxed">{t.passwordHint}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;
