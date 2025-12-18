self.addEventListener('push', function (event) {
    console.log('[Service Worker] Push Received.');
    console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

    let data = {};
    if (event.data) {
        try {
            data = event.data.json();
        } catch (e) {
            data = { title: 'Thông báo mới', body: event.data.text() };
        }
    }

    const title = data.title || 'VolunteerHub';
    const options = {
        body: data.body || 'Bạn có thông báo mới.',
        icon: '/vite.svg', // Default icon
        badge: '/vite.svg'
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function (event) {
    console.log('[Service Worker] Notification click Received.');

    event.notification.close();

    event.waitUntil(
        clients.openWindow('https://localhost:3000') // Adjust URL as needed
    );
});
