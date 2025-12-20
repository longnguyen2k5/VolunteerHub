import { useState, useEffect } from 'react';
import { notificationAPI } from '../api/notificationApi';
import { useAuth } from './useAuth';

// Hàm helper để convert VAPID Key từ Base64URL sang Uint8Array
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

// Hook xử lý đăng ký nhận Web Push Notification
export const usePushNotifications = () => {
    const { user } = useAuth();
    const [permission, setPermission] = useState(Notification.permission);

    useEffect(() => {
        if (user && permission === 'default') {
            // Có thể tự động hỏi quyền hoặc chờ hành động người dùng
            // Hiện tại đang chờ user kích hoạt thủ công
        }
    }, [user, permission]);

    const subscribeToPush = async () => {
        if (!('serviceWorker' in navigator)) return;
        if (!('PushManager' in window)) return;

        try {
            // 1. Yêu cầu quyền thông báo
            const perm = await Notification.requestPermission();
            setPermission(perm);
            if (perm !== 'granted') return;

            // 2. Đăng ký Service Worker
            const registration = await navigator.serviceWorker.register('/sw.js');

            // 3. Lấy VAPID Public Key từ Backend
            const response = await notificationAPI.getVapidKey();
            const vapidKey = response.data;
            const convertedVapidKey = urlBase64ToUint8Array(vapidKey);

            // 4. Kiểm tra subscription hiện có & Key rotation
            let subscription = await registration.pushManager.getSubscription();
            const savedVapidKey = localStorage.getItem('vapid_public_key');

            // Nếu đã có subscription nhưng key thay đổi (hoặc key mới), unsubscribe cái cũ
            if (subscription && savedVapidKey !== vapidKey) {
                console.warn("VAPID Key changed. Unsubscribing old worker...");
                await subscription.unsubscribe();
                subscription = null;
            }

            // 5. Subscribe mới (nếu chưa có)
            if (!subscription) {
                subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: convertedVapidKey
                });
                // Lưu key mới để xác nhận đã sync
                localStorage.setItem('vapid_public_key', vapidKey);
            }

            // 6. Gửi Subscription object lên Backend
            if (subscription) {
                await notificationAPI.subscribe(subscription.toJSON());
                console.log('Push Subscription sent to backend');
            }

        } catch (error) {
            console.error('Error subscribing to push:', error);
            // Fallback: Xử lý lỗi InvalidStateError (thường do SW lỗi trạng thái), thử unsubscribe và reload nhẹ
            if (error.name === 'InvalidStateError') {
                console.warn("Caught InvalidStateError. Nuke everything and retry...");
                try {
                    const reg = await navigator.serviceWorker.getRegistration();
                    const sub = await reg?.pushManager?.getSubscription();
                    if (sub) {
                        await sub.unsubscribe();
                        // Có thể force reload nếu cần: window.location.reload(); 
                    }
                } catch (cleanupErr) {
                    console.error("Cleanup failed:", cleanupErr);
                }
            }
        }
    };

    return {
        permission,
        subscribeToPush
    };
};
