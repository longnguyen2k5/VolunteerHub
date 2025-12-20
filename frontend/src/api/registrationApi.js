import axiosInstance from './axiosConfig';

export const registrationAPI = {
    // --- Tình nguyện viên ---

    // Đăng ký tham gia sự kiện
    registerForEvent: (eventId) => {
        return axiosInstance.post(`/registrations/events/${eventId}`);
    },

    // Hủy đăng ký
    cancelRegistration: (registrationId) => {
        return axiosInstance.delete(`/registrations/${registrationId}/cancel`);
    },

    // Lấy lịch sử đăng ký của tôi
    getMyRegistrations: () => {
        return axiosInstance.get('/registrations/my-registrations');
    },

    // --- Quản lý sự kiện ---

    // Lấy danh sách đăng ký của sự kiện
    getEventRegistrations: (eventId) => {
        return axiosInstance.get(`/registrations/events/${eventId}`);
    },

    // Duyệt đăng ký
    approveRegistration: (registrationId) => {
        return axiosInstance.put(`/registrations/${registrationId}/approve`);
    },

    // Từ chối đăng ký
    rejectRegistration: (registrationId) => {
        return axiosInstance.put(`/registrations/${registrationId}/reject`);
    },

    // Đánh dấu hoàn thành tham gia
    markAsCompleted: (registrationId) => {
        return axiosInstance.put(`/registrations/${registrationId}/complete`);
    },

    // Xuất danh sách đăng ký ra CSV
    exportEventRegistrations: async (eventId) => {
        const response = await axiosInstance.get(`/registrations/events/${eventId}/export`, {
            responseType: 'blob',
        });
        return response.data;
    },
};