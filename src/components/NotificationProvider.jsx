import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { showToast } from '../utils/helpers';

const NotificationContext = createContext();

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children, t, language, userProfile, prayerTimes }) => {
    const [permission, setPermission] = useState('default');
    const [settings, setSettings] = useState(() => {
        const saved = localStorage.getItem('azkar_notificationSettings');
        return saved ? JSON.parse(saved) : {
            prayerReminders: true,
            azkarReminders: true,
            sound: true
        };
    });

    // Check notification permission on mount
    useEffect(() => {
        if ('Notification' in window) {
            setPermission(Notification.permission);
        }
    }, []);

    // Save settings to localStorage
    useEffect(() => {
        localStorage.setItem('azkar_notificationSettings', JSON.stringify(settings));
    }, [settings]);

    // Request notification permission
    const requestPermission = useCallback(async () => {
        if (!('Notification' in window)) {
            showToast(language === 'en' ? 'Notifications not supported' : 'الإشعارات غير مدعومة', 'warning');
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

    // Schedule prayer time notifications
    useEffect(() => {
        if (!settings.prayerReminders || permission !== 'granted' || !prayerTimes) return;

        const now = new Date();
        const scheduleNotifications = () => {
            if (!prayerTimes) return;

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
                const prayerTime = new Date();
                prayerTime.setHours(hour, minute, 0, 0);

                // Schedule for today if time hasn't passed, or tomorrow
                if (prayerTime <= now) {
                    prayerTime.setDate(prayerTime.getDate() + 1);
                }

                const timeout = prayerTime.getTime() - now.getTime();
                
                // Only schedule if within 24 hours
                if (timeout > 0 && timeout < 24 * 60 * 60 * 1000) {
                    setTimeout(() => {
                        if (permission === 'granted') {
                            const title = t.notificationTitlePrayer;
                            const body = t.notificationBodyPrayer.replace('{name}', userProfile?.name || '');
                            new Notification(title, { body, icon: '/hesnok_logo1.png' });
                        }
                    }, timeout);
                }
            });
        };

        scheduleNotifications();
    }, [prayerTimes, settings.prayerReminders, permission, language, t, userProfile]);

    // Schedule azkar reminders (morning at 6 AM, evening at 6 PM)
    useEffect(() => {
        if (!settings.azkarReminders || permission !== 'granted') return;

        const scheduleAzkarReminders = () => {
            const now = new Date();
            
            // Morning reminder (6 AM)
            const morningTime = new Date();
            morningTime.setHours(6, 0, 0, 0);
            if (morningTime <= now) morningTime.setDate(morningTime.getDate() + 1);
            
            // Evening reminder (6 PM)
            const eveningTime = new Date();
            eveningTime.setHours(18, 0, 0, 0);
            if (eveningTime <= now) eveningTime.setDate(eveningTime.getDate() + 1);

            const morningTimeout = morningTime.getTime() - now.getTime();
            const eveningTimeout = eveningTime.getTime() - now.getTime();

            if (morningTimeout > 0 && morningTimeout < 24 * 60 * 60 * 1000) {
                setTimeout(() => {
                    if (permission === 'granted') {
                        const title = t.notificationTitleAzkar;
                        const body = t.notificationBodyAzkar.replace('{name}', userProfile?.name || '');
                        new Notification(title, { body, icon: '/hesnok_logo1.png' });
                    }
                }, morningTimeout);
            }

            if (eveningTimeout > 0 && eveningTimeout < 24 * 60 * 60 * 1000) {
                setTimeout(() => {
                    if (permission === 'granted') {
                        const title = t.notificationTitleAzkar;
                        const body = t.notificationBodyAzkar.replace('{name}', userProfile?.name || '');
                        new Notification(title, { body, icon: '/hesnok_logo1.png' });
                    }
                }, eveningTimeout);
            }
        };

        scheduleAzkarReminders();
    }, [settings.azkarReminders, permission, language, t, userProfile]);

    const updateSettings = useCallback((newSettings) => {
        setSettings(prev => ({ ...prev, ...newSettings }));
    }, []);

    return (
        <NotificationContext.Provider value={{
            permission,
            settings,
            requestPermission,
            updateSettings
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

export default NotificationProvider;