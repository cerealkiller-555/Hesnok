import React from 'react';
import { WifiOff } from 'lucide-react';

const OfflineBanner = ({ offline, t }) => {
    if (!offline) return null;

    return (
        <div className="offline-banner">
            <WifiOff className="w-4 h-4" />
            <span>{t.offlineNotice}</span>
        </div>
    );
};

export default OfflineBanner;
