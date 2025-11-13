import axiosInstance from './axiosConfig';

export const dashboardAPI = {
    /**
     * VOLUNTEER: Get dashboard statistics
     */
    getVolunteerStats: () => {
        return axiosInstance.get('/dashboard/volunteer/stats');
    },

    /**
     * EVENT_MANAGER: Get dashboard statistics
     */
    getManagerStats: () => {
        return axiosInstance.get('/dashboard/manager/stats');
    },

    /**
     * EVENT_MANAGER: Get my events with statistics
     */
    getMyEventsWithStats: () => {
        return axiosInstance.get('/dashboard/manager/events');
    },

    /**
     * ADMIN: Get system statistics
     */
    getAdminStats: () => {
        return axiosInstance.get('/dashboard/admin/stats');
    },

    /**
     * ADMIN: Get pending events for approval
     */
    getPendingEvents: (params) => {
        return axiosInstance.get('/admin/events/pending', { params });
    },

    /**
     * ADMIN: Approve an event
     */
    approveEvent: (eventId) => {
        return axiosInstance.post(`/admin/events/${eventId}/approve`);
    },

    /**
     * ADMIN: Reject an event
     */
    rejectEvent: (eventId, reason) => {
        return axiosInstance.post(`/admin/events/${eventId}/reject`, { reason });
    },

    /**
     * Get recent activities (for all roles)
     */
    getRecentActivities: () => {
        return axiosInstance.get('/dashboard/activities');
    },
};
