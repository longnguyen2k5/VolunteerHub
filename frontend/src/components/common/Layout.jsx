import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material'; // Bỏ import Toolbar (không dùng)
import Header from './Header';
import Footer from './Footer';

const Layout = () => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />

            {/* SỬA Ở ĐÂY: Xóa 'py: 3' */}
            <Box component="main" sx={{ flexGrow: 1 }}>
                <Outlet />
            </Box>

            <Footer />
        </Box>
    );
};

export default Layout;