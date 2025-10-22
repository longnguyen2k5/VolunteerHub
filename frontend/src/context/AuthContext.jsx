import React, { createContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import { authAPI } from '../api/authApi';
import { toast } from 'react-toastify';

// SỬA LỖI 1: Thêm chú thích eslint-disable-next-line
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Sử dụng useCallback để hàm logout không bị tạo lại
    // và có thể đưa vào mảng dependency của useEffect
    const logout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        toast.info('Đã đăng xuất');
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (token && userData) {
            try {
                const decoded = jwtDecode(token);
                if (decoded.exp * 1000 > Date.now()) {
                    setUser(JSON.parse(userData));
                } else {
                    logout();
                }
            } catch (error) {
                // SỬA LỖI 2: Dùng biến 'error' để log ra lỗi
                console.error("Lỗi giải mã token:", error);
                logout();
            }
        }
        setLoading(false);
    }, [logout]); // Thêm logout vào dependency array

    const login = async (email, password) => {
        try {
            const response = await authAPI.login(email, password);
            const { token, ...userData } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);

            toast.success('Đăng nhập thành công!');
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Đăng nhập thất bại';
            toast.error(message);
            return { success: false, error: message };
        }
    };

    const register = async (formData) => {
        try {
            const response = await authAPI.register(formData);
            const { token, ...userData } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);

            toast.success('Đăng ký thành công!');
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Đăng ký thất bại';
            toast.error(message);
            return { success: false, error: message };
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};