import axios from 'axios';
import axiosInstance from './axiosConfig';
import { oauth2Config } from '../config/oauth2Config';

export const authAPI = {
    /**
     * Register new user
     */
    register: (formData) => {
        return axiosInstance.post('/auth/register', formData);
    },

    /**
     * Exchange authorization code for access token
     */
    exchangeCodeForToken: ({ code, codeVerifier, redirectUri }) => {
        const params = new URLSearchParams({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: redirectUri,
            client_id: oauth2Config.clientId,
            code_verifier: codeVerifier,
        });

        return axios.post(oauth2Config.tokenEndpoint, params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
    },

    /**
     * Refresh access token
     */
    refreshAccessToken: (refreshToken) => {
        const params = new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
            client_id: oauth2Config.clientId,
        });

        return axios.post(oauth2Config.tokenEndpoint, params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
    },

    /**
     * Get current user info
     */
    getUserInfo: (token) => {
        return axios.get(oauth2Config.userInfoEndpoint, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    },
};