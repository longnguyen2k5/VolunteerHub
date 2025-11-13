import axiosInstance from './axiosConfig';

export const userAPI = {
    /**
     * Get current user profile
     */
    getProfile: () => {
        return axiosInstance.get('/users/me');
    },

    /**
     * Get volunteer's event history
     * (Các sự kiện đã đăng ký/tham gia)
     */
    getMyHistory: () => {
        return axiosInstance.get('/users/me/history');
    },

    /**
     * Update user profile
     */
    updateProfile: (userData) => {
        return axiosInstance.put('/users/me', userData);
    },

    /**
     * ADMIN: Get all users
     */
    getAllUsers: (params) => {
        return axiosInstance.get('/admin/users', { params });
    },

    /**
     * ADMIN: Lock a user account
     */
    lockUser: (userId) => {
        return axiosInstance.post(`/admin/users/${userId}/lock`);
    },

    /**
     * ADMIN: Unlock a user account
     */
    unlockUser: (userId) => {
        return axiosInstance.post(`/admin/users/${userId}/unlock`);
    },

    /**
     * ADMIN: Delete a user
     */
    deleteUser: (userId) => {
        return axiosInstance.delete(`/admin/users/${userId}`);
    },

    /**
     * ADMIN: Update user role
     */
    updateUserRole: (userId, role) => {
        return axiosInstance.put(`/admin/users/${userId}/role`, { role });
    },
};
