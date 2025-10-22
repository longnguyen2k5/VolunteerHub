import axiosInstance from './axiosConfig';

export const authAPI = {
    login: (email, password) => {
        return axiosInstance.post('/auth/login', { email, password });
    },

    register: (formData) => {
        return axiosInstance.post('/auth/register', formData);
    },
};