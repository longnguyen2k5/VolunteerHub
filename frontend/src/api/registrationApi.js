import axiosInstance from './axiosConfig';

export const registrationAPI = {
    // Volunteer endpoints
    registerForEvent: (eventId) => {
        return axiosInstance.post(`/registrations/events/${eventId}`);
    },

    cancelRegistration: (registrationId) => {
        return axiosInstance.delete(`/registrations/${registrationId}/cancel`);
    },

    getMyRegistrations: () => {
        return axiosInstance.get('/registrations/my-registrations');
    },

    // Organizer endpoints
    getEventRegistrations: (eventId) => {
        return axiosInstance.get(`/registrations/events/${eventId}`);
    },

    approveRegistration: (registrationId) => {
        return axiosInstance.put(`/registrations/${registrationId}/approve`);
    },

    rejectRegistration: (registrationId) => {
        return axiosInstance.put(`/registrations/${registrationId}/reject`);
    },

    markAsCompleted: (registrationId) => {
        return axiosInstance.put(`/registrations/${registrationId}/complete`);
    },
};