import React from 'react';
import { Plus, Heart, Trash2 } from 'lucide-react';

const CustomDuasSection = ({ customDuas, newDua, setNewDua, addCustomDua, deleteCustomDua, t }) => (
    <div className="animate-slide-up space-y-6">
        <div className="p-5 rounded-lg bg-[var(--bg-surface)] border border-[var(--glass-border)] text-[var(--text-primary)] shadow-sm">
            <h2 className="text-xl font-black mb-1 flex items-center gap-3">
                <Heart className="w-6 h-6 text-[var(--primary)]" />
                {t.customTitle}
            </h2>
            <p className="text-[var(--text-secondary)] text-sm font-medium leading-6">{t.customSubtitle}</p>
        </div>

        <div className="flex gap-2 bg-[var(--bg-surface)] rounded-lg shadow-sm border border-[var(--glass-border)] p-1.5">
            <input
                type="text"
                value={newDua}
                onChange={(e) => setNewDua(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCustomDua()}
                placeholder={t.customPlaceholder}
                className="flex-1 px-4 py-3 bg-transparent text-[var(--text-primary)] text-base focus:outline-none placeholder:text-[var(--text-tertiary)]"
            />
            <button
                onClick={addCustomDua}
                className="px-5 py-3 bg-[var(--primary)] text-white font-black text-sm rounded-lg hover:bg-[var(--primary-dark)] transition-all active:scale-95"
                aria-label={t.addDua}
            >
                <Plus className="w-5 h-5" />
            </button>
        </div>

        <div className="space-y-3">
            {!customDuas.length && (
                <div className="py-12 text-center">
                    <Heart className="w-10 h-10 text-[var(--text-tertiary)] mx-auto mb-4" />
                    <p className="text-[var(--text-secondary)] font-bold">{t.noDuas}</p>
                    <p className="text-sm text-[var(--text-tertiary)]">{t.noDuasHint}</p>
                </div>
            )}

            {customDuas.map((dua, index) => (
                <div key={dua.id || index} className="group p-5 bg-[var(--bg-surface)] rounded-lg shadow-sm border border-[var(--glass-border)] hover:shadow-md transition-all">
                    <div className="flex items-start justify-between gap-4">
                        <p className="text-lg font-amiri text-[var(--text-primary)] leading-relaxed flex-1">{dua.text}</p>
                        <button
                            onClick={() => deleteCustomDua(dua.id)}
                            className="p-2 rounded-lg bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-300 md:opacity-0 md:group-hover:opacity-100 transition-all hover:scale-105 active:scale-95 flex-shrink-0"
                            aria-label={t.deleteDua}
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default CustomDuasSection;
