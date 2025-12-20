import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Box, Tabs, Tab } from '@mui/material';

/**
 * Component Navbar phụ (Tabs) thường dùng trong các trang con (ví dụ: Profile, Dashboard).
 */
const Navbar = ({ items = [] }) => {
    const location = useLocation();
    const currentPath = location.pathname;

    // Tìm index của tab hiện tại dựa trên đường dẫn
    const currentIndex = items.findIndex(item => item.path === currentPath);

    return (
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs
                value={currentIndex !== -1 ? currentIndex : 0}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                    '& .MuiTab-root': {
                        textTransform: 'none',
                        fontSize: '1rem',
                        fontWeight: 500,
                    },
                }}
            >
                {items.map((item, index) => (
                    <Tab
                        key={index}
                        label={item.label}
                        component={Link}
                        to={item.path}
                        icon={item.icon}
                        iconPosition="start"
                    />
                ))}
            </Tabs>
        </Box>
    );
};

export default Navbar;
