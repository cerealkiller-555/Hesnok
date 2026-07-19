import React from 'react';
import ReactDOM from 'react-dom/client';
import '../style.css';
import AzkarApp from './components/AzkarApp';

// ═══════════════════════════════════════════
// Global Error Boundary
// Catches render-phase crashes and shows a
// fallback UI instead of a blank screen.
// ═══════════════════════════════════════════
class AppErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { error: null };
    }

    static getDerivedStateFromError(error) {
        return { error };
    }

    componentDidCatch(error, errorInfo) {
        // Production-safe error logging
        if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
            // In production, we could send to an error service
        }
    }

    render() {
        if (this.state.error) {
            return (
                <div style={{
                    minHeight: '100vh',
                    padding: '24px',
                    background: '#fff7ed',
                    color: '#7c2d12',
                    fontFamily: 'system-ui, sans-serif'
                }}>
                    <h1 style={{ marginBottom: '12px', fontSize: '22px', fontWeight: 800 }}>
                        App crashed while rendering
                    </h1>
                    <p style={{ marginBottom: '12px', lineHeight: 1.6 }}>
                        {this.state.error?.message || 'Unknown render error'}
                    </p>
                    <pre style={{
                        whiteSpace: 'pre-wrap',
                        background: '#ffedd5',
                        padding: '16px',
                        borderRadius: '12px',
                        overflow: 'auto'
                    }}>
                        {this.state.error?.stack || 'No stack trace available'}
                    </pre>
                    <button
                        onClick={() => { localStorage.clear(); window.location.reload(); }}
                        style={{
                            marginTop: '16px',
                            padding: '12px 24px',
                            background: '#7c2d12',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: 700,
                            cursor: 'pointer'
                        }}
                    >
                        Clear Data & Reload
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

// ═══════════════════════════════════════════
// Dark Mode — synchronous init before first render
// Reads saved preference and applies the `dark`
// class to <html> immediately so the login screen
// (which renders outside AzkarApp's dark wrapper)
// also gets the correct theme from the first paint.
// ═══════════════════════════════════════════
(function initDarkMode() {
    try {
        const isDark = localStorage.getItem('azkarDarkMode') === 'true';
        document.documentElement.classList.toggle('dark', isDark);
    } catch (e) {
        // localStorage unavailable (e.g. private mode restrictions) — ignore
    }
})();

// ═══════════════════════════════════════════
// Mount
// ═══════════════════════════════════════════
const rootElement = document.getElementById('root');

if (rootElement) {
    const root = window.__AZKAR_ROOT__ || ReactDOM.createRoot(rootElement);
    window.__AZKAR_ROOT__ = root;
    root.render(
        <React.StrictMode>
            <AppErrorBoundary>
                <AzkarApp />
            </AppErrorBoundary>
        </React.StrictMode>
    );
} else {
    console.error('Root element not found!');
}

// ═══════════════════════════════════════════
// Analytics & Speed Insights - Load after app is interactive
// Defer non-critical scripts until after first paint
// ═══════════════════════════════════════════
if (typeof window !== 'undefined') {
    // Use requestIdleCallback for better performance
    const loadAnalytics = () => {
        // Dynamically import Vercel analytics for better performance
        import('@vercel/analytics/react').then(({ Analytics }) => {
            const container = document.createElement('div');
            const analyticsRoot = ReactDOM.createRoot(container);
            analyticsRoot.render(<Analytics />);
            document.body.appendChild(container);
        }).catch(() => {});
        
        import('@vercel/speed-insights/react').then(({ SpeedInsights }) => {
            const container = document.createElement('div');
            const insightsRoot = ReactDOM.createRoot(container);
            insightsRoot.render(<SpeedInsights />);
            document.body.appendChild(container);
        }).catch(() => {});
    };
    
    // Load analytics when the browser is idle or after load event
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => loadAnalytics(), { timeout: 3000 });
    } else {
        window.addEventListener('load', loadAnalytics);
    }
}

// ═══════════════════════════════════════════
// Service Worker — production only
// On github.io we clear stale caches to
// ensure latest deployment is shown.
// ═══════════════════════════════════════════
if (typeof window !== 'undefined' && window.location.hostname.endsWith('github.io')) {
    window.addEventListener('load', async () => {
        if ('serviceWorker' in navigator) {
            const registrations = await navigator.serviceWorker.getRegistrations();
            await Promise.all(registrations.map((r) => r.unregister()));
        }
        if ('caches' in window) {
            const cacheNames = await caches.keys();
            await Promise.all(cacheNames.map((name) => caches.delete(name)));
        }
    });
}