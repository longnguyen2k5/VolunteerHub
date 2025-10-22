import axiosInstance from './axiosConfig';

export const eventAPI = {
    getAllApproved: () => {
        return axiosInstance.get('/events/public');
    },

    getById: (id) => {
        return axiosInstance.get(`/events/public/${id}`);
    },

    getUpcoming: () => {
        return axiosInstance.get('/events/upcoming');
    },

    getByCategory: (category) => {
        return axiosInstance.get(`/events/category/${category}`);
    },

    create: (eventData) => {
        return axiosInstance.post('/events', eventData);
    },

    update: (id, eventData) => {
        return axiosInstance.put(`/events/${id}`, eventData);
    },

    delete: (id) => {
        return axiosInstance.delete(`/events/${id}`);
    },

    getMyEvents: () => {
        return axiosInstance.get('/events/my-events');
    },

    approve: (id) => {
        return axiosInstance.put(`/events/${id}/approve`);
    },

    reject: (id) => {
        return axiosInstance.put(`/events/${id}/reject`);
    },

    getPending: () => {
        return axiosInstance.get('/events/pending');
    },
};