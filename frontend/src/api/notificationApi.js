import axiosInstance from './axiosConfig';

export const notificationAPI = {
    getVapidKey: () => {
        return axiosInstance.get('/notifications/vapid-key');
    },

    subscribe: (subscription) => {
        return axiosInstance.post('/notifications/subscribe', subscription);
    }
};
