import axiosInstance from './axiosConfig';

export const userAPI = {
    /**
     * Lấy thông tin hồ sơ người dùng hiện tại
     */
    getProfile: () => {
        return axiosInstance.get('/users/me');
    },

    /**
     * Lấy lịch sử hoạt động tình nguyện
     * (Các sự kiện đã đăng ký/tham gia)
     */
    getMyHistory: () => {
        return axiosInstance.get('/users/me/history');
    },

    /**
     * Cập nhật hồ sơ người dùng
     */
    updateProfile: (userData) => {
        return axiosInstance.put('/users/me', userData);
    },

    /**
     * ADMIN: Lấy danh sách người dùng (kèm phân trang/lọc)
     */
    getAllUsers: (params) => {
        return axiosInstance.get('/admin/users', { params });
    },

    /**
     * ADMIN: Khóa tài khoản người dùng
     */
    lockUser: (userId) => {
        return axiosInstance.post(`/admin/users/${userId}/lock`);
    },

    /**
     * ADMIN: Mở khóa tài khoản người dùng
     */
    unlockUser: (userId) => {
        return axiosInstance.post(`/admin/users/${userId}/unlock`);
    },

    /**
     * ADMIN: Xóa người dùng
     */
    deleteUser: (userId) => {
        return axiosInstance.delete(`/admin/users/${userId}`);
    },

    /**
     * ADMIN: Cập nhật vai trò người dùng
     */
    updateUserRole: (userId, role) => {
        return axiosInstance.put(`/admin/users/${userId}/role`, { role });
    },
};
