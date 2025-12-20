import axiosInstance from './axiosConfig';

export const dashboardApi = {
    // Lấy số liệu thống kê cho Dashboard
    getStats: () => axiosInstance.get('/dashboard')
};
