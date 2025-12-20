import axios from 'axios';
import { oauth2Config } from '../config/oauth2Config';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - Tự động đính kèm Access Token vào header
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(oauth2Config.accessTokenKey);

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Xử lý lỗi 401 (Token hết hạn)
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Nếu lỗi 401 và chưa thử lại lần nào
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Thử làm mới token (Refresh Token)
                const refreshToken = localStorage.getItem(oauth2Config.refreshTokenKey);

                if (refreshToken) {
                    const response = await axios.post(
                        oauth2Config.tokenEndpoint,
                        new URLSearchParams({
                            grant_type: 'refresh_token',
                            refresh_token: refreshToken,
                            client_id: oauth2Config.clientId,
                        }),
                        {
                            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        }
                    );

                    const { access_token } = response.data;
                    localStorage.setItem(oauth2Config.accessTokenKey, access_token);

                    // Thử lại request ban đầu với token mới
                    originalRequest.headers.Authorization = `Bearer ${access_token}`;
                    return axiosInstance(originalRequest);
                }
            } catch (refreshError) {
                // Làm mới thất bại -> Đăng xuất
                localStorage.clear();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;