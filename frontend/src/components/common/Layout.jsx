import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from './Header';
import Footer from './Footer';

/**
 * Layout chính của ứng dụng.
 * Bao gồm Header, Footer và nội dung thay đổi (Outlet).
 * Xử lý padding top để không bị che bởi Header fixed.
 */
const Layout = () => {
    const location = useLocation();
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default', transition: 'background-color 0.3s' }}>
            <Header />

            {/* Padding top khoảng 80px (pt: 10) cho các trang thường để tránh bị header che.
                Trang Home (/) và Chi tiết sự kiện có Hero section riêng nên không cần padding top (pt: 0). */}
            <Box component="main" sx={{ flexGrow: 1, pt: (location.pathname === '/' || /^\/events\/\d+$/.test(location.pathname)) ? 0 : 10 }}>
                <Outlet />
            </Box>

            <Footer />
        </Box>
    );
};

export default Layout;