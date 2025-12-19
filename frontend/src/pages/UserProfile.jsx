import React from 'react';
import {
    Container,
    Paper,
    Typography,
    Box,
    Avatar,
    Grid,
    Divider,
    Button,
    Chip
} from '@mui/material';
import {
    Email,
    Person,
    Badge,
    CalendarToday,
    Edit
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { format } from 'date-fns';

const UserProfile = () => {
    const { user } = useAuth();

    if (!user) return null;

    const roleLabels = {
        ADMIN: "Quản trị viên",
        EVENT_MANAGER: "Quản lý sự kiện",
        VOLUNTEER: "Tình nguyện viên"
    };

    const roleColors = {
        ADMIN: "error.main",
        EVENT_MANAGER: "primary.main",
        VOLUNTEER: "success.main"
    };

    return (
        <Container maxWidth="md" sx={{ py: 8 }}>
            <Paper elevation={0} sx={{
                p: 6,
                borderRadius: '24px',
                bgcolor: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'white'
            }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 6 }}>
                    <Avatar
                        sx={{
                            width: 140,
                            height: 140,
                            bgcolor: roleColors[user.role] || 'primary.main',
                            fontSize: '3.5rem',
                            mb: 3,
                            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                            border: '4px solid rgba(255,255,255,0.1)'
                        }}
                    >
                        {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                    </Avatar>
                    <Typography variant="h3" fontWeight={800} sx={{
                        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        mb: 1
                    }}>
                        {user.fullName}
                    </Typography>
                    <Chip
                        label={roleLabels[user.role] || user.role}
                        sx={{
                            bgcolor: 'rgba(255,255,255,0.1)',
                            color: 'white',
                            fontWeight: 600,
                            border: '1px solid rgba(255,255,255,0.2)'
                        }}
                    />
                </Box>

                <Divider sx={{ mb: 6, borderColor: 'rgba(255,255,255,0.1)' }} />

                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Box sx={{
                                bgcolor: 'rgba(255,255,255,0.05)',
                                p: 2,
                                borderRadius: '16px',
                                mr: 3,
                                color: '#FF8E53'
                            }}>
                                <Email fontSize="large" color="inherit" />
                            </Box>
                            <Box>
                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 1 }}>
                                    Email
                                </Typography>
                                <Typography variant="h6" fontWeight={500}>
                                    {user.email}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Box sx={{
                                bgcolor: 'rgba(255,255,255,0.05)',
                                p: 2,
                                borderRadius: '16px',
                                mr: 3,
                                color: '#FE6B8B'
                            }}>
                                <CalendarToday fontSize="large" color="inherit" />
                            </Box>
                            <Box>
                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 1 }}>
                                    Ngày tham gia
                                </Typography>
                                <Typography variant="h6" fontWeight={500}>
                                    {user.createdAt ? format(new Date(user.createdAt), 'dd/MM/yyyy') : 'N/A'}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>

                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', mt: 2 }}>
                            <Box sx={{
                                bgcolor: 'rgba(255,255,255,0.05)',
                                p: 2,
                                borderRadius: '16px',
                                mr: 3,
                                color: 'white'
                            }}>
                                <Person fontSize="large" color="inherit" />
                            </Box>
                            <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 1 }}>
                                    Giới thiệu
                                </Typography>
                                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', fontStyle: 'italic', mt: 1, lineHeight: 1.6 }}>
                                    (Chưa có thông tin giới thiệu)
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>

                <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center' }}>
                    <Button
                        variant="outlined"
                        startIcon={<Edit />}
                        disabled
                        sx={{
                            borderRadius: '30px',
                            px: 4,
                            py: 1.5,
                            borderColor: 'rgba(255,255,255,0.3)',
                            color: 'rgba(255,255,255,0.5)',
                            '&:hover': {
                                borderColor: '#FF8E53',
                                color: '#FF8E53'
                            }
                        }}
                    >
                        Chỉnh sửa thông tin
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default UserProfile;
