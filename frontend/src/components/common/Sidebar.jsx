import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
    Toolbar,
    Typography,
    Box,
} from '@mui/material';

/**
 * Component Sidebar (Drawer bên trái) để điều hướng.
 * Hỗ trợ các item menu động và trạng thái active.
 */
const Sidebar = ({ items = [], open = true, onClose, variant = 'permanent', width = 240 }) => {
    const location = useLocation();

    return (
        <Drawer
            variant={variant}
            open={open}
            onClose={onClose}
            sx={{
                width: width,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: width,
                    boxSizing: 'border-box',
                },
            }}
        >
            <Toolbar>
                <Typography variant="h6" noWrap component="div">
                    Menu
                </Typography>
            </Toolbar>
            <Divider />
            <Box sx={{ overflow: 'auto' }}>
                <List>
                    {items.map((item, index) => (
                        <ListItem key={index} disablePadding>
                            <ListItemButton
                                component={Link}
                                to={item.path}
                                selected={location.pathname === item.path}
                                sx={{
                                    '&.Mui-selected': {
                                        backgroundColor: 'primary.light',
                                        color: 'white',
                                        '&:hover': {
                                            backgroundColor: 'primary.main',
                                        },
                                    },
                                }}
                            >
                                {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
                                <ListItemText primary={item.label} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Drawer>
    );
};

export default Sidebar;
