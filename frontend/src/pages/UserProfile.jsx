import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Typography,
    Box,
    Avatar,
    Grid,
    Divider,
    Button,
    Chip,
    TextField,
    CircularProgress
} from '@mui/material';
import {
    Email,
    Person,
    Badge,
    CalendarToday,
    Edit,
    Save,
    Cancel,
    LocationOn
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { format } from 'date-fns';
import { useThemeContext } from '../context/ThemeContext';
import { authAPI } from '../api/authApi';
import { registrationAPI } from '../api/registrationApi';
import { toast } from 'react-toastify';

/**
 * Trang hồ sơ người dùng (Profile).
 * Cho phép xem và chỉnh sửa thông tin cá nhân.
 * Hiển thị lịch sử tham gia sự kiện (nếu là Volunteer).
 */
const UserProfile = () => {
    const { user, refreshUser } = useAuth();
    const { glassSx } = useThemeContext();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: ''
    });
    const [registrations, setRegistrations] = useState([]);

    // Lấy danh sách sự kiện đã đăng ký
    useEffect(() => {
        const fetchRegistrations = async () => {
            try {
                const response = await registrationAPI.getMyRegistrations();
                setRegistrations(response.data);
            } catch (error) {
                console.error("Failed to fetch registrations:", error);
            }
        };

        if (user && user.role === 'VOLUNTEER') {
            fetchRegistrations();
        }
    }, [user]);

    // Cập nhật form data khi user thay đổi
    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.fullName || '',
                email: user.email || ''
            });
        }
    }, [user]);

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

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelClick = () => {
        setIsEditing(false);
        setFormData({
            fullName: user.fullName || '',
            email: user.email || ''
        });
    };

    const handleSaveClick = async () => {
        if (!formData.fullName.trim()) {
            toast.error("Tên không được để trống");
            return;
        }

        setLoading(true);
        try {
            await authAPI.updateProfile({ fullName: formData.fullName });
            await refreshUser();
            toast.success("Cập nhật thông tin thành công");
            setIsEditing(false);
        } catch (error) {
            toast.error("Cập nhật thất bại: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <Container maxWidth="md" sx={{ py: 8 }}>
            <Paper elevation={0} sx={{
                p: 6,
                ...glassSx,
                borderRadius: '24px',
                color: 'text.primary'
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
                            border: '4px solid',
                            borderColor: 'background.paper'
                        }}
                    >
                        {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                    </Avatar>

                    {isEditing ? (
                        <TextField
                            fullWidth
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            variant="outlined"
                            sx={{ maxWidth: 400, mb: 2 }}
                            inputProps={{ style: { textAlign: 'center', fontSize: '1.5rem', fontWeight: 700 } }}
                        />
                    ) : (
                        <Typography variant="h3" fontWeight={800} sx={{
                            background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mb: 1,
                            textAlign: 'center'
                        }}>
                            {user.fullName}
                        </Typography>
                    )}

                    <Chip
                        label={roleLabels[user.role] || user.role}
                        sx={{
                            bgcolor: 'action.hover',
                            color: 'text.primary',
                            fontWeight: 600,
                            border: '1px solid',
                            borderColor: 'divider'
                        }}
                    />
                </Box>

                <Divider sx={{ mb: 6, borderColor: 'divider' }} />

                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Box sx={{
                                bgcolor: 'action.hover',
                                p: 2,
                                borderRadius: '16px',
                                mr: 3,
                                color: 'primary.main'
                            }}>
                                <Email fontSize="large" color="inherit" />
                            </Box>
                            <Box sx={{ width: '100%' }}>
                                <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1 }}>
                                    Email
                                </Typography>
                                {isEditing ? (
                                    <TextField
                                        fullWidth
                                        value={formData.email}
                                        disabled
                                        variant="standard"
                                        InputProps={{ disableUnderline: true }}
                                        sx={{
                                            '& .MuiInputBase-input': {
                                                fontSize: '1.25rem',
                                                fontWeight: 500,
                                                color: 'text.disabled',
                                                cursor: 'not-allowed'
                                            }
                                        }}
                                    />
                                ) : (
                                    <Typography variant="h6" fontWeight={500}>
                                        {user.email}
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Box sx={{
                                bgcolor: 'action.hover',
                                p: 2,
                                borderRadius: '16px',
                                mr: 3,
                                color: 'secondary.main'
                            }}>
                                <CalendarToday fontSize="large" color="inherit" />
                            </Box>
                            <Box>
                                <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1 }}>
                                    Ngày tham gia
                                </Typography>
                                <Typography variant="h6" fontWeight={500}>
                                    {user.createdAt ? format(new Date(user.createdAt), 'dd/MM/yyyy') : 'N/A'}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>

                    <Grid item xs={12}>
                        <Box sx={{ mt: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <Box sx={{
                                    bgcolor: 'action.hover',
                                    p: 2,
                                    borderRadius: '16px',
                                    mr: 3,
                                    color: 'text.primary'
                                }}>
                                    <Badge fontSize="large" color="inherit" />
                                </Box>
                                <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1 }}>
                                    Sự kiện đã tham gia
                                </Typography>
                            </Box>

                            {registrations.filter(reg => ['APPROVED', 'COMPLETED'].includes(reg.status)).length === 0 ? (
                                <Typography variant="body1" sx={{ color: 'text.secondary', fontStyle: 'italic', textAlign: 'center', py: 4 }}>
                                    (Chưa tham gia sự kiện nào)
                                </Typography>
                            ) : (
                                <Box component="ul" sx={{ pl: 2, m: 0 }}>
                                    {registrations
                                        .filter(reg => ['APPROVED', 'COMPLETED'].includes(reg.status))
                                        .map((reg) => (
                                            <Box component="li" key={reg.id} sx={{ mb: 1 }}>
                                                <Typography variant="body1" fontWeight={500}>
                                                    {reg.eventName}
                                                </Typography>
                                            </Box>
                                        ))}
                                </Box>
                            )}
                        </Box>
                    </Grid>
                </Grid>

                <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center', gap: 2 }}>
                    {isEditing ? (
                        <>
                            <Button
                                variant="outlined"
                                startIcon={<Cancel />}
                                onClick={handleCancelClick}
                                disabled={loading}
                                sx={{
                                    borderRadius: '30px',
                                    px: 4,
                                    py: 1.5,
                                    borderColor: 'divider',
                                    color: 'text.secondary',
                                    '&:hover': {
                                        borderColor: 'text.primary',
                                        color: 'text.primary'
                                    }
                                }}
                            >
                                Hủy bỏ
                            </Button>
                            <Button
                                variant="contained"
                                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
                                onClick={handleSaveClick}
                                disabled={loading}
                                sx={{
                                    borderRadius: '30px',
                                    px: 4,
                                    py: 1.5,
                                    bgcolor: 'primary.main',
                                    color: 'white',
                                    '&:hover': {
                                        bgcolor: 'primary.dark',
                                    }
                                }}
                            >
                                Lưu thay đổi
                            </Button>
                        </>
                    ) : (
                        <Button
                            variant="contained"
                            startIcon={<Edit />}
                            onClick={handleEditClick}
                            sx={{
                                borderRadius: '30px',
                                px: 4,
                                py: 1.5,
                                bgcolor: 'primary.main',
                                color: 'white',
                                boxShadow: '0 4px 14px 0 rgba(0,118,255,0.39)',
                                '&:hover': {
                                    bgcolor: 'primary.dark',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 6px 20px rgba(0,118,255,0.23)'
                                },
                                transition: 'all 0.2s ease-in-out'
                            }}
                        >
                            Chỉnh sửa thông tin
                        </Button>
                    )}
                </Box>
            </Paper>
        </Container>
    );
};

export default UserProfile;
