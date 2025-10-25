import axios from 'axios';
import { oauth2Config } from '../config/oauth2Config';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - Auto attach access token
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

// Response interceptor - Handle 401 (token expired)
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If 401 and not already retried
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Try to refresh token
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

                    // Retry original request with new token
                    originalRequest.headers.Authorization = `Bearer ${access_token}`;
                    return axiosInstance(originalRequest);
                }
            } catch (refreshError) {
                // Refresh failed, logout
                localStorage.clear();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;