import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Box } from '@mui/material'; // Bỏ import Toolbar (không dùng)
import Header from './Header';
import Footer from './Footer';

const Layout = () => {
    const location = useLocation();
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#121212' }}>
            <Header />

            {/* Padding top 9 (approx 72px) for normal pages to clear the fixed Header. 
                Home (/) and Event Detail (/events/:id) have their own Hero visuals so they start at 0. */}
            <Box component="main" sx={{ flexGrow: 1, pt: (location.pathname === '/' || /^\/events\/\d+$/.test(location.pathname)) ? 0 : 10 }}>
                <Outlet />
            </Box>

            <Footer />
        </Box>
    );
};

export default Layout;