import axiosInstance from './axiosConfig';

export const dashboardApi = {
    getStats: () => axiosInstance.get('/dashboard')
};
