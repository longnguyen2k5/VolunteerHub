import { useState, useEffect } from 'react';
import { notificationAPI } from '../api/notificationApi';
import { useAuth } from './useAuth';

const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
};

export const usePushNotifications = () => {
    const { user } = useAuth();
    const [permission, setPermission] = useState(Notification.permission);

    useEffect(() => {
        if (user && permission === 'default') {
            // Auto ask? Or wait for user action?
            // Let's safe auto ask for now or provide a function
        }
    }, [user, permission]);

    const subscribeToPush = async () => {
        if (!('serviceWorker' in navigator)) return;
        if (!('PushManager' in window)) return;

        try {
            // 1. Request Permission
            const perm = await Notification.requestPermission();
            setPermission(perm);
            if (perm !== 'granted') return;

            // 2. Register SW
            const registration = await navigator.serviceWorker.register('/sw.js');

            // 3. Get VAPID Key
            const response = await notificationAPI.getVapidKey();
            const vapidKey = response.data;
            const convertedVapidKey = urlBase64ToUint8Array(vapidKey);

            // 4. Subscribe
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: convertedVapidKey
            });

            // 5. Send to Backend
            await notificationAPI.subscribe(subscription.toJSON());
            console.log('Push Subscription sent to backend');

        } catch (error) {
            console.error('Error subscribing to push:', error);
        }
    };

    return {
        permission,
        subscribeToPush
    };
};
