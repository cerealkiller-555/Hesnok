import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { showToast } from '../utils/helpers';

const NotificationContext = createContext();

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within NotificationProvider');
    }
    return context;
};

// Store timeout IDs for cleanup
const scheduledTimeouts = new Map();
const TIMEOUT_STORAGE_KEY = 'azkar_scheduled_timeouts_sent';

export const NotificationProvider = ({ children, t, language, userProfile, prayerTimes }) => {
    const [permission, setPermission] = useState('default');
    const [settings, setSettings] = useState(() => {
        const saved = localStorage.getItem('azkar_notificationSettings');
        return saved ? JSON.parse(saved) : {
            prayerReminders: true,
            azkarReminders: true,
            sound: true,
            webPushEnabled: false
        };
    });
    const [isSubscribed, setIsSubscribed] = useState(false);

    // Track already-sent notifications by date
    const sentNotifications = useRef(new Set());

    // Check notification permission on mount
    useEffect(() => {
        if ('Notification' in window) {
            setPermission(Notification.permission);
        }
        
        // Check if user is already subscribed to push
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            navigator.serviceWorker.ready.then(registration => {
                return registration.pushManager.getSubscription();
            }).then(subscription => {
                setIsSubscribed(!!subscription);
            }).catch(() => {
                setIsSubscribed(false);
            });
        }
    }, []);

    // Save settings to localStorage
    useEffect(() => {
        localStorage.setItem('azkar_notificationSettings', JSON.stringify(settings));
    }, [settings]);

    // Load sent notifications tracking for today
    useEffect(() => {
        const today = new Date().toDateString();
        const saved = localStorage.getItem(`${TIMEOUT_STORAGE_KEY}_${today}`);
        if (saved) {
            try {
                sentNotifications.current = new Set(JSON.parse(saved));
            } catch (e) {
                console.warn('Failed to parse sent notifications:', e);
            }
        } else {
            sentNotifications.current.clear();
        }
    }, []);

    // Clear all pending notifications
    const clearAllTimeouts = useCallback(() => {
        scheduledTimeouts.forEach((timeoutId) => {
            clearTimeout(timeoutId);
        });
        scheduledTimeouts.clear();
    }, []);

    // Schedule a notification and track it
    const scheduleNotification = useCallback((id, timeout, callback) => {
        const timeoutId = setTimeout(callback, timeout);
        scheduledTimeouts.set(id, timeoutId);
        return timeoutId;
    }, []);

    // Mark a notification as sent
    const markAsSent = useCallback((id) => {
        sentNotifications.current.add(id);
        const today = new Date().toDateString();
        localStorage.setItem(`${TIMEOUT_STORAGE_KEY}_${today}`, JSON.stringify([...sentNotifications.current]));
    }, []);

    // Request notification permission
    const requestPermission = useCallback(async () => {
        if (!('Notification' in window)) {
            showToast(language === 'en' ? 'Notifications not supported' : 'الإشعارات غير مدعومة', 'warning');
            return false;
        }

        if (Notification.permission === 'denied') {
            showToast(language === 'en' ? 'Notifications blocked - please enable in browser settings' : 'تم حظر الإشعارات - يرجى تفعيلها في إعدادات المتصفح', 'warning');
            setPermission('denied');
            return false;
        }

        const result = await Notification.requestPermission();
        setPermission(result);
        
        if (result === 'granted') {
            showToast(language === 'en' ? 'Notifications enabled!' : 'تم تفعيل الإشعارات!', 'success');
            return true;
        } else if (result === 'denied') {
            showToast(language === 'en' ? 'Notifications blocked' : 'تم حظر الإشعارات', 'warning');
        }
        return false;
    }, [language]);

    // Fetch VAPID public key from server
    const fetchVapidPublicKey = useCallback(async () => {
        try {
            const response = await fetch('/api/push/vapid-public-key');
            const data = await response.json();
            return data.publicKey;
        } catch (error) {
            console.error('Failed to fetch VAPID key:', error);
            return null;
        }
    }, []);

    // Subscribe to Web Push
    const subscribeToPush = useCallback(async () => {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
            showToast(language === 'en' ? 'Push notifications not supported' : 'إشعارات الدفع غير مدعومة', 'warning');
            return false;
        }

        try {
            const registration = await navigator.serviceWorker.ready;
            const vapidKey = await fetchVapidPublicKey();
            
            if (!vapidKey) {
                throw new Error('Failed to get VAPID key from server');
            }
            
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(vapidKey)
            });

            // Send subscription to server
            const response = await fetch('/api/push/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: userProfile?.email,
                    subscription: subscription
                })
            });

            if (response.ok) {
                setIsSubscribed(true);
                updateSettings({ webPushEnabled: true });
                showToast(language === 'en' ? 'Web Push enabled!' : 'تم تفعيل الإشعارات الخفية!', 'success');
                return true;
            } else {
                throw new Error('Failed to save subscription');
            }
        } catch (error) {
            console.error('Push subscription failed:', error);
            showToast(language === 'en' ? 'Failed to enable Web Push' : 'فشل تفعيل الإشعارات الخفية', 'error');
            return false;
        }
    }, [userProfile?.email, language, updateSettings]);

    // Unsubscribe from Web Push
    const unsubscribeFromPush = useCallback(async () => {
        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();
            
            if (subscription) {
                await fetch('/api/push/unsubscribe', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ endpoint: subscription.endpoint })
                });
                await subscription.unsubscribe();
            }
            
            setIsSubscribed(false);
            updateSettings({ webPushEnabled: false });
            showToast(language === 'en' ? 'Web Push disabled' : 'تم إيقاف الإشعارات الخفية', 'success');
            return true;
        } catch (error) {
            console.error('Push unsubscription failed:', error);
            showToast(language === 'en' ? 'Failed to disable Web Push' : 'فشل إيقاف الإشعارات الخفية', 'error');
            return false;
        }
    }, [language, updateSettings]);

    // Send test notification
    const sendTestNotification = useCallback(async () => {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
            // Fallback to regular notification
            if (permission === 'granted') {
                new Notification('Hesnok', {
                    body: language === 'en' ? 'Test notification - Web Push works!' : '🔔 اختبار إشعارات حصنك',
                    icon: '/hesnok_logo1.png'
                });
            }
            return;
        }

        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();
            
            if (subscription) {
                await fetch('/api/push/test', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        endpoint: subscription.endpoint,
                        keys: subscription.keys
                    })
                });
            } else {
                // Fallback to regular notification
                if (permission === 'granted') {
                    new Notification(t.notificationTitleAzkar || 'Hesnok', {
                        body: language === 'en' ? 'Test notification!' : '🔔 اختبار إشعارات حصنك',
                        icon: '/hesnok_logo1.png'
                    });
                }
            }
        } catch (error) {
            console.error('Test notification failed:', error);
            // Fallback to regular notification
            if (permission === 'granted') {
                new Notification(t.notificationTitleAzkar || 'Hesnok', {
                    body: language === 'en' ? 'Test notification!' : '🔔 اختبار إشعارات حصنك',
                    icon: '/hesnok_logo1.png'
                });
            }
        }
    }, [permission, language, t]);

    // Schedule prayer time notifications
    useEffect(() => {
        if (!settings.prayerReminders || permission !== 'granted' || !prayerTimes) {
            clearAllTimeouts();
            return;
        }

        clearAllTimeouts();

        const now = new Date();
        const prayers = [
            { key: 'Fajr', label: language === 'en' ? 'Fajr Prayer' : 'صلاة الفجر' },
            { key: 'Dhuhr', label: language === 'en' ? 'Dhuhr Prayer' : 'صلاة الظهر' },
            { key: 'Asr', label: language === 'en' ? 'Asr Prayer' : 'صلاة العصر' },
            { key: 'Maghrib', label: language === 'en' ? 'Maghrib Prayer' : 'صلاة المغرب' },
            { key: 'Isha', label: language === 'en' ? 'Isha Prayer' : 'صلاة العشاء' }
        ];

        prayers.forEach(prayer => {
            const timeStr = prayerTimes[prayer.key];
            if (!timeStr) return;

            const [hour, minute] = timeStr.split(':').map(n => parseInt(n, 10));
            
            [0, 1].forEach(dayOffset => {
                const prayerTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() + dayOffset);
                prayerTime.setHours(hour, minute, 0, 0);

                const timeout = prayerTime.getTime() - now.getTime();
                
                if (timeout > 1000 && timeout < 48 * 60 * 60 * 1000) {
                    const notificationId = `${prayer.key}_${dayOffset}`;
                    
                    if (dayOffset === 0 && sentNotifications.current.has(notificationId)) {
                        return;
                    }
                    
                    scheduleNotification(
                        notificationId,
                        timeout,
                        () => {
                            if (permission === 'granted') {
                                const title = t.notificationTitlePrayer;
                                const body = t.notificationBodyPrayer.replace('{name}', userProfile?.name || '');
                                new Notification(title, { body, icon: '/hesnok_logo1.png' });
                                markAsSent(notificationId);
                            }
                        }
                    );
                }
            });
        });
    }, [prayerTimes, settings.prayerReminders, permission, language, t, userProfile, clearAllTimeouts]);

    // Schedule azkar reminders
    useEffect(() => {
        if (!settings.azkarReminders || permission !== 'granted' || !prayerTimes) return;

        const azkarKeys = Array.from(scheduledTimeouts.keys()).filter(k => k.startsWith('azkar_'));
        azkarKeys.forEach(key => clearTimeout(scheduledTimeouts.get(key)));
        azkarKeys.forEach(key => scheduledTimeouts.delete(key));

        const now = new Date();
        
        if (prayerTimes.Fajr) {
            const fajrMatch = prayerTimes.Fajr.match(/(\d+):(\d+)/);
            if (fajrMatch) {
                const [, hour, minute] = fajrMatch;
                [0, 1].forEach(dayOffset => {
                    const fajrTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() + dayOffset);
                    fajrTime.setHours(parseInt(hour, 10), parseInt(minute, 10) + 5, 0, 0);

                    const morningTimeout = fajrTime.getTime() - now.getTime();
                    if (morningTimeout > 1000 && morningTimeout < 48 * 60 * 60 * 1000) {
                        const notificationId = `azkar_morning_${dayOffset}`;
                        
                        if (dayOffset === 0 && sentNotifications.current.has(notificationId)) {
                            return;
                        }
                        
                        scheduleNotification(
                            notificationId,
                            morningTimeout,
                            () => {
                                if (permission === 'granted') {
                                    const title = t.notificationTitleAzkar;
                                    const body = language === 'en' 
                                        ? `${t.notificationBodyAzkar.replace('{name}', userProfile?.name || '')} - Morning Azkar time` 
                                        : 'حان وقت أذكار الصباح بعد صلاة الفجر';
                                    new Notification(title, { body, icon: '/hesnok_logo1.png' });
                                    markAsSent(notificationId);
                                }
                            }
                        );
                    }
                });
            }
        }
        
        if (prayerTimes.Asr) {
            const asrMatch = prayerTimes.Asr.match(/(\d+):(\d+)/);
            if (asrMatch) {
                const [, hour, minute] = asrMatch;
                [0, 1].forEach(dayOffset => {
                    const asrTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() + dayOffset);
                    asrTime.setHours(parseInt(hour, 10), parseInt(minute, 10) + 5, 0, 0);

                    const eveningTimeout = asrTime.getTime() - now.getTime();
                    if (eveningTimeout > 1000 && eveningTimeout < 48 * 60 * 60 * 1000) {
                        const notificationId = `azkar_evening_${dayOffset}`;
                        
                        if (dayOffset === 0 && sentNotifications.current.has(notificationId)) {
                            return;
                        }
                        
                        scheduleNotification(
                            notificationId,
                            eveningTimeout,
                            () => {
                                if (permission === 'granted') {
                                    const title = t.notificationTitleAzkar;
                                    const body = language === 'en' 
                                        ? `${t.notificationBodyAzkar.replace('{name}', userProfile?.name || '')} - Evening Azkar time` 
                                        : 'حان وقت أذكار المساء بعد صلاة العصر';
                                    new Notification(title, { body, icon: '/hesnok_logo1.png' });
                                    markAsSent(notificationId);
                                }
                            }
                        );
                    }
                });
            }
        }
    }, [settings.azkarReminders, permission, language, t, userProfile, prayerTimes, scheduleNotification]);

    // Handle visibility change - re-check permission
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && 'Notification' in window) {
                setPermission(Notification.permission);
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            clearAllTimeouts();
        };
    }, [clearAllTimeouts]);

    const updateSettings = useCallback((newSettings) => {
        setSettings(prev => ({ ...prev, ...newSettings }));
    }, []);

    return (
        <NotificationContext.Provider value={{
            permission,
            settings,
            isSubscribed,
            requestPermission,
            updateSettings,
            subscribeToPush,
            unsubscribeFromPush,
            sendTestNotification
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

// Convert base64 to Uint8Array for applicationServerKey
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export default NotificationProvider;