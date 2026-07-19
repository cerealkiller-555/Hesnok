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

    // Schedule azkar reminders based on prayer times
    // Morning: after Fajr prayer (+5 minutes)
    // Evening: after Asr prayer (+5 minutes)
    useEffect(() => {
        if (!settings.azkarReminders || permission !== 'granted' || !prayerTimes) return;

        const scheduleAzkarReminders = () => {
            const now = new Date();
            
            // Morning azkar reminder - after Fajr prayer (+5 minutes)
            if (prayerTimes.Fajr) {
                const fajrTime = new Date();
                const [hour, minute] = prayerTimes.Fajr.split(':').map(n => parseInt(n, 10));
                fajrTime.setHours(hour, minute + 5, 0, 0); // Add 5 minutes
                if (fajrTime <= now) fajrTime.setDate(fajrTime.getDate() + 1);
                
                const morningTimeout = fajrTime.getTime() - now.getTime();
                if (morningTimeout > 0 && morningTimeout < 24 * 60 * 60 * 1000) {
                    setTimeout(() => {
                        if (permission === 'granted') {
                            const title = t.notificationTitleAzkar;
                            const body = language === 'en' 
                                ? `${t.notificationBodyAzkar.replace('{name}', userProfile?.name || '')} - Morning Azkar time` 
                                : `حان وقت أذكار الصباح بعد صلاة الفجر`;
                            new Notification(title, { body, icon: '/hesnok_logo1.png' });
                        }
                    }, morningTimeout);
                }
            }
            
            // Evening azkar reminder - after Asr prayer (+5 minutes)
            if (prayerTimes.Asr) {
                const asrTime = new Date();
                const [hour, minute] = prayerTimes.Asr.split(':').map(n => parseInt(n, 10));
                asrTime.setHours(hour, minute + 5, 0, 0); // Add 5 minutes
                if (asrTime <= now) asrTime.setDate(asrTime.getDate() + 1);
                
                const eveningTimeout = asrTime.getTime() - now.getTime();
                if (eveningTimeout > 0 && eveningTimeout < 24 * 60 * 60 * 1000) {
                    setTimeout(() => {
                        if (permission === 'granted') {
                            const title = t.notificationTitleAzkar;
                            const body = language === 'en' 
                                ? `${t.notificationBodyAzkar.replace('{name}', userProfile?.name || '')} - Evening Azkar time` 
                                : `حان وقت أذكار المساء بعد صلاة العصر`;
                            new Notification(title, { body, icon: '/hesnok_logo1.png' });
                        }
                    }, eveningTimeout);
                }
            }
        };

        scheduleAzkarReminders();
    }, [settings.azkarReminders, permission, language, t, userProfile, prayerTimes]);

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