import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Box, Typography, Button } from '@mui/material';
import { Block as BlockIcon } from '@mui/icons-material';

/**
 * Forbidden (403) page - shown when user tries to access unauthorized route
 */
const Forbidden = () => {
    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    mt: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                }}
            >
                <BlockIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
                
                <Typography variant="h3" gutterBottom>
                    403
                </Typography>
                
                <Typography variant="h5" gutterBottom color="text.secondary">
                    Truy cập bị từ chối
                </Typography>
                
                <Typography variant="body1" sx={{ mb: 4 }} color="text.secondary">
                    Bạn không có quyền truy cập trang này. Vui lòng liên hệ quản trị viên nếu bạn cho rằng đây là lỗi.
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="contained"
                        component={Link}
                        to="/"
                        size="large"
                    >
                        Về trang chủ
                    </Button>
                    
                    <Button
                        variant="outlined"
                        component={Link}
                        to="/dashboard"
                        size="large"
                    >
                        Dashboard
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default Forbidden;
