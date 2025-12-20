import axiosInstance from './axiosConfig';

export const notificationAPI = {
    // Lấy VAPID public key từ server
    getVapidKey: () => {
        return axiosInstance.get('/notifications/vapid-key');
    },

    // Gửi subscription object lên server để đăng ký nhận thông báo
    subscribe: (subscription) => {
        return axiosInstance.post('/notifications/subscribe', subscription);
    }
};
