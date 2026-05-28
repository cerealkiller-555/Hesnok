import React from 'react';
import ReactDOM from 'react-dom/client';
import '../style.css';
import AzkarApp from './components/AzkarApp';
import { Analytics } from '@vercel/analytics/react';

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
        console.error('App render failed:', error, errorInfo);
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
                <Analytics />
            </AppErrorBoundary>
        </React.StrictMode>
    );
} else {
    console.error('Root element not found!');
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
