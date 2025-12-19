import React from 'react';
import {
    Container,
    Paper,
    Typography,
    Box,
    Avatar,
    Grid,
    Divider,
    Button
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
        <Container maxWidth="md" sx={{ py: 5 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
                    <Avatar
                        sx={{
                            width: 120,
                            height: 120,
                            bgcolor: roleColors[user.role] || 'primary.main',
                            fontSize: '3rem',
                            mb: 2,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                    >
                        {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                    </Avatar>
                    <Typography variant="h4" fontWeight="bold">
                        {user.fullName}
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        sx={{
                            color: roleColors[user.role] || 'text.secondary',
                            fontWeight: 600,
                            mt: 0.5
                        }}
                    >
                        {roleLabels[user.role] || user.role}
                    </Typography>
                </Box>

                <Divider sx={{ mb: 4 }} />

                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <Box sx={{
                                bgcolor: 'grey.100',
                                p: 1.5,
                                borderRadius: 2,
                                mr: 2
                            }}>
                                <Email color="action" />
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.secondary">
                                    Email
                                </Typography>
                                <Typography variant="body1" fontWeight={500}>
                                    {user.email}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <Box sx={{
                                bgcolor: 'grey.100',
                                p: 1.5,
                                borderRadius: 2,
                                mr: 2
                            }}>
                                <CalendarToday color="action" />
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.secondary">
                                    Ngày tham gia
                                </Typography>
                                <Typography variant="body1" fontWeight={500}>
                                    {user.createdAt ? format(new Date(user.createdAt), 'dd/MM/yyyy') : 'N/A'}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>

                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <Box sx={{
                                bgcolor: 'grey.100',
                                p: 1.5,
                                borderRadius: 2,
                                mr: 2
                            }}>
                                <Person color="action" />
                            </Box>
                            <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="caption" color="text.secondary">
                                    Giới thiệu
                                </Typography>
                                <Typography variant="body1" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                    (Chưa có thông tin giới thiệu)
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>

                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                    <Button
                        variant="outlined"
                        startIcon={<Edit />}
                        disabled
                        sx={{ borderRadius: 2 }}
                    >
                        Chỉnh sửa thông tin
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default UserProfile;
