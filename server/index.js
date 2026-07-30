require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');
const webpush = require('web-push');

const app = express();
const port = process.env.PORT || 5000;

// Configure Web Push with VAPID keys
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;
const WEB_PUSH_EMAIL = process.env.WEB_PUSH_EMAIL;

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
    webpush.setVapidDetails(
        WEB_PUSH_EMAIL || 'mailto:notifications@example.com',
        VAPID_PUBLIC_KEY,
        VAPID_PRIVATE_KEY
    );
}

app.use(cors());
app.use(express.json());

// API Endpoints

// 1. Push Subscriptions API

// Get VAPID public key
app.get('/api/push/vapid-public-key', (req, res) => {
    if (!VAPID_PUBLIC_KEY) {
        return res.status(500).json({ error: 'VAPID_PUBLIC_KEY not configured' });
    }
    res.json({ publicKey: VAPID_PUBLIC_KEY });
});

// Save push subscription
app.post('/api/push/subscribe', (req, res) => {
    const { email, subscription } = req.body;
    
    if (!email || !subscription || !subscription.endpoint) {
        return res.status(400).json({ error: 'Email and subscription are required' });
    }

    const { endpoint, keys } = subscription;
    
    db.get('SELECT id FROM push_subscriptions WHERE endpoint = ?', [endpoint], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        
        if (row) {
            db.run(
                'UPDATE push_subscriptions SET user_email = ?, p256dh = ?, auth = ? WHERE endpoint = ?',
                [email, keys.p256dh, keys.auth, endpoint],
                (err) => {
                    if (err) return res.status(500).json({ error: err.message });
                    res.json({ message: 'Subscription updated successfully' });
                }
            );
        } else {
            db.run(
                'INSERT INTO push_subscriptions (user_email, endpoint, p256dh, auth) VALUES (?, ?, ?, ?)',
                [email, endpoint, keys.p256dh, keys.auth],
                function(err) {
                    if (err) return res.status(500).json({ error: err.message });
                    res.json({ message: 'Subscription saved successfully', id: this.lastID });
                }
            );
        }
    });
});

// Remove push subscription
app.post('/api/push/unsubscribe', (req, res) => {
    const { endpoint } = req.body;
    
    if (!endpoint) {
        return res.status(400).json({ error: 'Endpoint is required' });
    }

    db.run('DELETE FROM push_subscriptions WHERE endpoint = ?', [endpoint], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Subscription removed successfully' });
    });
});

// Get all subscriptions (for sending notifications)
app.get('/api/push/subscriptions', (req, res) => {
    db.all('SELECT user_email, endpoint, p256dh, auth FROM push_subscriptions', (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Send test notification
app.post('/api/push/test', (req, res) => {
    const { endpoint, keys } = req.body;
    
    if (!endpoint || !keys) {
        return res.status(400).json({ error: 'Endpoint and keys are required' });
    }

    if (!VAPID_PRIVATE_KEY) {
        // Fallback - return info that this is a placeholder
        return res.json({ 
            message: 'Test endpoint ready - VAPID_PRIVATE_KEY required for real push',
            endpoint: endpoint.substring(0, 50) + '...'
        });
    }

    const subscription = {
        endpoint,
        keys
    };

    webpush.sendNotification(subscription, JSON.stringify({
        title: 'Hesnok',
        body: '🔔 اختبار إشعارات حصنك',
        icon: '/hesnok_logo1.png',
        tag: 'test-notification'
    })).then(() => {
        res.json({ message: 'Test notification sent successfully' });
    }).catch((error) => {
        console.error('Push notification error:', error.message);
        res.status(500).json({ error: 'Failed to send notification: ' + error.message });
    });
});

app.listen(port, () => {
    console.log(`Backend server is running on http://localhost:${port}`);
});