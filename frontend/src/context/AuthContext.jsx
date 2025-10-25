import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { authAPI } from '../api/authApi';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import {
    generateCodeVerifier,
    generateCodeChallenge,
    storeCodeVerifier,
    getCodeVerifier,
    clearCodeVerifier,
    generateAndStoreState,
    verifyState
} from '../utils/pkce';
import { oauth2Config } from '../config/oauth2Config';


// SỬA LỖI 1: Thêm chú thích eslint-disable-next-line
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        checkAuth();
    }, []);

    /**
     * Check if user is authenticated on app load
     */
    const checkAuth = async () => {
        const token = localStorage.getItem(oauth2Config.accessTokenKey);

        if (token) {
            try {
                // Check if token is expired
                const decoded = jwtDecode(token);
                if (decoded.exp * 1000 > Date.now()) {
                    // Token valid, fetch user info
                    await fetchUserInfo(token);
                } else {
                    // Token expired, try refresh
                    await refreshToken();
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                logout();
            }
        }

        setLoading(false);
    };

    /**
     * Fetch user info from backend
     */
    const fetchUserInfo = async (token) => {
        try {
            const response = await authAPI.getUserInfo(token);
            setUser(response.data);
        } catch (error) {
            console.error('Failed to fetch user info:', error);
            logout();
        }
    };

    /**
     * Start OAuth2 Authorization Code Flow with PKCE
     */
    const login = () => {
        try {
            // 1. Generate PKCE parameters
            const codeVerifier = generateCodeVerifier();
            const codeChallenge = generateCodeChallenge(codeVerifier);

            // 2. Store verifier for later use
            storeCodeVerifier(codeVerifier);

            // 3. Generate state for CSRF protection
            const state = generateAndStoreState();

            // 4. Build authorization URL
            const params = new URLSearchParams({
                response_type: 'code',
                client_id: oauth2Config.clientId,
                redirect_uri: oauth2Config.redirectUri,
                scope: oauth2Config.scopes,
                state: state,
                code_challenge: codeChallenge,
                code_challenge_method: oauth2Config.codeChallengeMethod,
            });

            // 5. Redirect to authorization endpoint
            window.location.href = `${oauth2Config.authorizationEndpoint}?${params.toString()}`;
        } catch (error) {
            console.error('Login failed:', error);
            toast.error('Failed to initiate login');
        }
    };

    /**
     * Handle OAuth2 callback with authorization code
     */
    const handleCallback = async (code, state) => {
        try {
            // 1. Verify state
            if (!verifyState(state)) {
                throw new Error('Invalid state parameter');
            }

            // 2. Get code verifier
            const codeVerifier = getCodeVerifier();
            if (!codeVerifier) {
                throw new Error('Code verifier not found');
            }

            // 3. Exchange code for tokens
            const tokenResponse = await authAPI.exchangeCodeForToken({
                code,
                codeVerifier,
                redirectUri: oauth2Config.redirectUri,
            });

            // 4. Store tokens
            const { access_token, refresh_token, expires_in } = tokenResponse.data;
            localStorage.setItem(oauth2Config.accessTokenKey, access_token);

            if (refresh_token) {
                localStorage.setItem(oauth2Config.refreshTokenKey, refresh_token);
            }

            if (expires_in) {
                const expiryTime = Date.now() + expires_in * 1000;
                localStorage.setItem(oauth2Config.tokenExpiryKey, expiryTime.toString());
            }

            // 5. Clear code verifier
            clearCodeVerifier();

            // 6. Fetch user info
            await fetchUserInfo(access_token);

            toast.success('Login successful!');
            navigate('/dashboard');

            return { success: true };
        } catch (error) {
            console.error('Callback handling failed:', error);
            toast.error('Login failed: ' + (error.response?.data?.error_description || error.message));
            clearCodeVerifier();
            navigate('/login');
            return { success: false, error: error.message };
        }
    };

    /**
     * Refresh access token using refresh token
     */
    const refreshToken = async () => {
        try {
            const refreshToken = localStorage.getItem(oauth2Config.refreshTokenKey);

            if (!refreshToken) {
                throw new Error('No refresh token available');
            }

            const response = await authAPI.refreshAccessToken(refreshToken);
            const { access_token, refresh_token, expires_in } = response.data;

            localStorage.setItem(oauth2Config.accessTokenKey, access_token);

            if (refresh_token) {
                localStorage.setItem(oauth2Config.refreshTokenKey, refresh_token);
            }

            if (expires_in) {
                const expiryTime = Date.now() + expires_in * 1000;
                localStorage.setItem(oauth2Config.tokenExpiryKey, expiryTime.toString());
            }

            await fetchUserInfo(access_token);

            return { success: true };
        } catch (error) {
            console.error('Token refresh failed:', error);
            logout();
            return { success: false };
        }
    };

    /**
     * Register new user
     */
    const register = async (formData) => {
        try {
            await authAPI.register(formData);
            toast.success('Registration successful! Please login.');
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Registration failed';
            toast.error(message);
            return { success: false, error: message };
        }
    };

    /**
     * Logout user
     */
    const logout = () => {
        localStorage.removeItem(oauth2Config.accessTokenKey);
        localStorage.removeItem(oauth2Config.refreshTokenKey);
        localStorage.removeItem(oauth2Config.tokenExpiryKey);
        clearCodeVerifier();
        setUser(null);
        toast.info('Logged out successfully');
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            register,
            logout,
            handleCallback,
            refreshToken
        }}>
            {children}
        </AuthContext.Provider>
    );
};