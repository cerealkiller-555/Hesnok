import React from 'react';

const LoadingSkeleton = ({ count = 3 }) => (
    <div className="space-y-5">
        {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="animate-pulse">
                <div className="rounded-lg overflow-hidden bg-[var(--bg-surface)] border border-[var(--glass-border)] shadow-sm p-5">
                    <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3 flex-1">
                            <div className="w-10 h-10 rounded-lg bg-bg-subtle" />
                            <div className="h-6 w-32 rounded-lg bg-bg-subtle" />
                        </div>
                        <div className="flex gap-2">
                            <div className="w-10 h-10 rounded-lg bg-bg-subtle" />
                            <div className="w-10 h-10 rounded-lg bg-bg-subtle" />
                        </div>
                    </div>
                    <div className="space-y-2 mb-6">
                        <div className="h-6 w-full rounded bg-bg-subtle" />
                        <div className="h-6 w-5/6 rounded bg-bg-subtle" />
                    </div>
                    <div className="h-12 rounded-lg bg-bg-subtle" />
                </div>
            </div>
        ))}
    </div>
);

export default LoadingSkeleton;
