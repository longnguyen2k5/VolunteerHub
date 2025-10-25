import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Container, Typography, Box } from '@mui/material';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    if (!user) return null;

    return (
        <Container sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom>
                Dashboard {user.role}
            </Typography>
            <Box sx={{ mt: 4 }}>
                <Typography variant="body1">
                    Xin chào, <strong>{user.fullName}</strong>!
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Email: {user.email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Vai trò: {user.role}
                </Typography>
            </Box>
        </Container>
    );
};

export default Dashboard;