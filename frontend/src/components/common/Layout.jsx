import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Box } from '@mui/material'; // Bỏ import Toolbar (không dùng)
import Header from './Header';
import Footer from './Footer';

const Layout = () => {
    const location = useLocation();
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />

            {/* Padding top only if NOT home page to avoid header overlap */}
            <Box component="main" sx={{ flexGrow: 1, pt: location.pathname === '/' ? 0 : 9 }}>
                <Outlet />
            </Box>

            <Footer />
        </Box>
    );
};

export default Layout;