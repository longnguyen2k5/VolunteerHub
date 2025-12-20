import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    Chip,
    Grid,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Divider,
} from '@mui/material';
import {
    LocationOn,
    CalendarToday,
    People,
    PersonAdd,
    Cancel,
    ArrowBack,
    Forum,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { toast } from 'react-toastify';
import { eventAPI } from '../../api/eventApi';
import { registrationAPI } from '../../api/registrationApi';
import { useAuth } from '../../hooks/useAuth';
import { useThemeContext } from '../../context/ThemeContext';

const EventDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [registering, setRegistering] = useState(false);
    const [myRegistration, setMyRegistration] = useState(null);
    const [confirmDialog, setConfirmDialog] = useState({ open: false, action: null });
    const { glassSx, mode } = useThemeContext();

    useEffect(() => {
        fetchEventDetails();
        if (user?.role === 'VOLUNTEER') {
            checkMyRegistration();
        }
    }, [id]);

    const fetchEventDetails = async () => {
        try {
            const response = await eventAPI.getById(id);
            setEvent(response.data);
        } catch (error) {
            toast.error('Không thể tải thông tin sự kiện:', error);
            navigate('/events');
        } finally {
            setLoading(false);
        }
    };

    const checkMyRegistration = async () => {
        try {
            const response = await registrationAPI.getMyRegistrations();
            const registration = response.data.find(r => r.eventId === parseInt(id));
            setMyRegistration(registration);
        } catch (error) {
            console.error('Error checking registration:', error);
        }
    };

    const handleRegister = async () => {
        setRegistering(true);
        try {
            await registrationAPI.registerForEvent(id);
            toast.success('Đăng ký thành công! Vui lòng chờ BTC duyệt.');
            checkMyRegistration();
            fetchEventDetails();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Đăng ký thất bại');
        } finally {
            setRegistering(false);
            setConfirmDialog({ open: false, action: null });
        }
    };

    const handleCancelRegistration = async () => {
        setRegistering(true);
        try {
            await registrationAPI.cancelRegistration(myRegistration.id);
            toast.success('Đã hủy đăng ký');
            setMyRegistration(null);
            fetchEventDetails();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Không thể hủy đăng ký');
        } finally {
            setRegistering(false);
            setConfirmDialog({ open: false, action: null });
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            PENDING: 'warning',
            APPROVED: 'success',
            REJECTED: 'error',
            COMPLETED: 'info',
            CANCELLED: 'default',
        };
        return colors[status] || 'default';
    };

    const getStatusText = (status) => {
        const texts = {
            PENDING: 'Chờ duyệt',
            APPROVED: 'Đã duyệt',
            REJECTED: 'Từ chối',
            COMPLETED: 'Hoàn thành',
            CANCELLED: 'Đã hủy',
        };
        return texts[status] || status;
    };

    const CATEGORY_LABELS = {
        EDUCATION: "Giáo dục",
        ENVIRONMENT: "Môi trường",
        HEALTH: "Y tế",
        COMMUNITY: "Cộng đồng",
        EMERGENCY_RELIEF: "Cứu trợ khẩn cấp",
        OTHER: "Khác",
    };

    const canRegister = () => {
        if (!user || user.role !== 'VOLUNTEER') return false;
        // Allow if not registered OR if registered but status is CANCELLED/REJECTED
        if (myRegistration && !['CANCELLED', 'REJECTED'].includes(myRegistration.status)) return false;

        if (event?.maxParticipants && event?.currentParticipants >= event.maxParticipants) return false;
        if (new Date(event?.startTime) < new Date()) return false;
        if (event?.status !== 'APPROVED') return false;
        return true;
    };

    const canCancel = () => {
        if (!myRegistration) return false;
        if (myRegistration.status === 'COMPLETED' || myRegistration.status === 'CANCELLED') return false;
        if (new Date(event?.startTime) < new Date()) return false;
        return true;
    };

    const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1174";

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress sx={{ color: 'primary.main' }} />
            </Box>
        );
    }

    if (!event) return null;

    return (
        <Box sx={{
            minHeight: '100vh',
            bgcolor: 'background.default',
            color: 'text.primary',
            pb: 8
        }}>
            {/* HERRO BANNER SECTION */}
            <Box sx={{
                position: 'relative',
                height: '60vh',
                minHeight: '500px',
                width: '100%',
                backgroundImage: `url(${event.imageUrl || DEFAULT_IMAGE})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'flex-end',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    // Use a gradient that fades to the current theme background
                    // Hard to match exact hex variable in pure CSS calc, so we stick to dark overlay for text readability on hero
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.8) 90%, rgba(0,0,0,0.95) 100%)',
                    zIndex: 1
                }
            }}>
                {/* Navigation (Back Button) absolute positioned on top */}
                <Container maxWidth="xl" sx={{ position: 'absolute', top: 80, left: 0, right: 0, zIndex: 10, px: { xs: 2, md: 6 } }}>
                    <Button
                        startIcon={<ArrowBack />}
                        onClick={() => navigate('/events')}
                        sx={{
                            color: 'white', // Keep white on hero image
                            bgcolor: 'rgba(0,0,0,0.4)',
                            backdropFilter: 'blur(4px)',
                            px: 3,
                            py: 1,
                            borderRadius: '30px',
                            '&:hover': { bgcolor: 'rgba(0,0,0,0.6)' }
                        }}
                    >
                        Quay lại
                    </Button>
                </Container>

                {/* Hero Content - Always dark theme text here because of background image */}
                <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2, pb: 8, px: { xs: 2, md: 6 } }}>
                    <Box sx={{ maxWidth: '900px' }}>
                        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                            <Chip
                                label={CATEGORY_LABELS[event.category] || event.category || 'Chung'}
                                sx={{
                                    bgcolor: 'primary.main',
                                    color: 'white',
                                    fontWeight: 700,
                                    fontSize: '0.9rem'
                                }}
                            />
                            <Chip
                                label={getStatusText(event.status === 'APPROVED' ? (new Date() < new Date(event.startTime) ? 'PENDING' : 'COMPLETED') : event.status)}
                                sx={{
                                    bgcolor: 'rgba(255,255,255,0.2)',
                                    color: 'white',
                                    backdropFilter: 'blur(4px)',
                                    fontWeight: 600
                                }}
                            />
                        </Box>

                        <Typography variant="h1" sx={{
                            fontWeight: 900,
                            fontSize: { xs: '2.5rem', md: '4.5rem' },
                            lineHeight: 1.1,
                            mb: 3,
                            textShadow: '0 4px 20px rgba(0,0,0,0.5)',
                            background: 'linear-gradient(45deg, #FFF 30%, #FF8E53 90%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            {event.name}
                        </Typography>

                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 6, color: 'rgba(255,255,255,0.9)' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <CalendarToday sx={{ fontSize: 32, mr: 2, color: 'primary.main' }} />
                                <Box>
                                    <Typography variant="body2" sx={{ opacity: 0.7 }}>Thời gian</Typography>
                                    <Typography variant="h6" fontWeight={600}>
                                        {format(new Date(event.startTime), 'HH:mm - dd/MM/yyyy', { locale: vi })}
                                        {event.endTime && (
                                            <>
                                                <br />
                                                đến {format(new Date(event.endTime), 'HH:mm - dd/MM/yyyy', { locale: vi })}
                                            </>
                                        )}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <LocationOn sx={{ fontSize: 32, mr: 2, color: 'primary.main' }} />
                                <Box>
                                    <Typography variant="body2" sx={{ opacity: 0.7 }}>Địa điểm</Typography>
                                    <Typography variant="h6" fontWeight={600}>
                                        {event.location}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Container>
            </Box>

            {/* MAIN CONTENT */}
            <Container maxWidth="xl" sx={{ px: { xs: 2, md: 6 }, mt: -4, position: 'relative', zIndex: 3 }}>
                <Grid container spacing={6}>
                    {/* LEFT COLUMN: Description & Details */}
                    <Grid item xs={12} md={8}>
                        <Box sx={{ mb: 6 }}>
                            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: 'white', mb: 3, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                                Giới thiệu sự kiện
                            </Typography>
                            <Typography variant="body1" sx={{
                                color: mode === 'light' ? '#4a4a4a' : 'text.secondary',
                                fontSize: '1.1rem',
                                lineHeight: 1.8,
                                whiteSpace: 'pre-line'
                            }}>
                                {event.description}
                            </Typography>
                        </Box>

                        <Divider sx={{ bgcolor: 'divider', mb: 6 }} />

                        <Box sx={{ mb: 6 }}>
                            <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: mode === 'light' ? '#1a1a1a' : 'text.primary', mb: 3 }}>
                                Thông tin tổ chức
                            </Typography>

                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 3,
                                ...glassSx,
                                p: 3,
                                borderRadius: '16px',
                            }}>
                                <Box sx={{
                                    width: 60,
                                    height: 60,
                                    bgcolor: 'primary.main',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 700,
                                    fontSize: '1.5rem',
                                    color: 'white'
                                }}>
                                    {event.managerName?.charAt(0)}
                                </Box>
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>{event.managerName}</Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>Người quản lý sự kiện</Typography>
                                </Box>

                                {/* Channel Button in Organizr section if valid */}
                                {event.status === 'APPROVED' && ((myRegistration?.status === 'APPROVED' || myRegistration?.status === 'COMPLETED') || (user?.id === event.managerId)) && (
                                    <Button
                                        variant="outlined"
                                        startIcon={<Forum />}
                                        onClick={() => navigate(`/events/${id}/channel`)}
                                        sx={{
                                            ml: 'auto',
                                            borderColor: 'divider',
                                            color: 'text.primary',
                                            '&:hover': {
                                                borderColor: 'primary.main',
                                                color: 'primary.main',
                                                bgcolor: 'action.hover'
                                            }
                                        }}
                                    >
                                        Kênh trao đổi
                                    </Button>
                                )}
                            </Box>
                        </Box>
                    </Grid>

                    {/* RIGHT COLUMN: Sticky Registration Card */}
                    <Grid item xs={12} md={4}>
                        <Card sx={{
                            position: 'sticky',
                            top: 40,
                            ...glassSx,
                            borderRadius: '24px',
                            color: 'text.primary',
                            p: 1
                        }}>
                            <CardContent sx={{ p: 4 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                                        Số chỗ còn lại
                                    </Typography>
                                    <Typography variant="h3" sx={{ fontWeight: 800, color: 'primary.main' }}>
                                        {event.maxParticipants - event.currentParticipants}
                                    </Typography>
                                </Box>

                                <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: '12px', mb: 4 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>Tổng số lượng</Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>{event.maxParticipants} người</Typography>
                                    </Box>
                                    <Divider sx={{ my: 1, borderColor: 'divider' }} />
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>Đã đăng ký</Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>{event.currentParticipants} người</Typography>
                                    </Box>
                                </Box>

                                {myRegistration ? (
                                    <Box>
                                        <Chip
                                            label={`Trạng thái: ${getStatusText(myRegistration.status)}`}
                                            color={getStatusColor(myRegistration.status)}
                                            sx={{ mb: 3, width: '100%', borderRadius: '12px', fontWeight: 700, p: 2, height: 'auto', '& .MuiChip-label': { whiteSpace: 'normal' } }}
                                        />

                                        <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', color: 'text.secondary', mb: 2 }}>
                                            Đăng ký lúc: {format(new Date(myRegistration.registeredAt), 'dd/MM/yyyy HH:mm')}
                                        </Typography>

                                        {canCancel() && (
                                            <Button
                                                fullWidth
                                                variant="outlined"
                                                color="error"
                                                startIcon={<Cancel />}
                                                onClick={() => setConfirmDialog({ open: true, action: 'cancel' })}
                                                disabled={registering}
                                                sx={{ borderRadius: '12px', py: 1.5 }}
                                            >
                                                Hủy đăng ký
                                            </Button>
                                        )}

                                        {['CANCELLED', 'REJECTED'].includes(myRegistration.status) && canRegister() && (
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                size="large"
                                                startIcon={<PersonAdd />}
                                                onClick={() => setConfirmDialog({ open: true, action: 'register' })}
                                                disabled={registering}
                                                sx={{
                                                    mt: 2,
                                                    borderRadius: '12px',
                                                    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                                                    color: 'white',
                                                    py: 1.5,
                                                    fontWeight: 700
                                                }}
                                            >
                                                {registering ? <CircularProgress size={24} color="inherit" /> : 'Đăng ký lại'}
                                            </Button>
                                        )}
                                    </Box>
                                ) : (
                                    <Box>
                                        {canRegister() ? (
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                size="large"
                                                startIcon={<PersonAdd />}
                                                onClick={() => setConfirmDialog({ open: true, action: 'register' })}
                                                disabled={registering}
                                                sx={{
                                                    borderRadius: '50px',
                                                    py: 2,
                                                    fontSize: '1.2rem',
                                                    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                                                    boxShadow: '0 10px 30px rgba(255, 142, 83, 0.4)',
                                                    fontWeight: 800,
                                                    transition: 'all 0.3s',
                                                    '&:hover': {
                                                        transform: 'scale(1.02)',
                                                        boxShadow: '0 15px 40px rgba(255, 142, 83, 0.6)',
                                                    }
                                                }}
                                            >
                                                {registering ? <CircularProgress size={24} color="inherit" /> : 'ĐĂNG KÝ THAM GIA'}
                                            </Button>
                                        ) : (
                                            <Box sx={{ p: 2, textAlign: 'center', color: 'text.secondary', bgcolor: 'action.hover', borderRadius: '12px' }}>
                                                <Typography variant="body2">
                                                    {[
                                                        !user && 'Vui lòng đăng nhập để đăng ký',
                                                        user?.role !== 'VOLUNTEER' && 'Chỉ tình nguyện viên mới có thể đăng ký',
                                                        event.currentParticipants >= event.maxParticipants && 'Đã đủ người tham gia',
                                                        new Date(event.endTime) < new Date() ? 'Sự kiện đã kết thúc' : (new Date(event.startTime) < new Date() && 'Sự kiện đã bắt đầu'),
                                                        event.status !== 'APPROVED' && 'Sự kiện chưa được duyệt'
                                                    ].filter(Boolean).join(' | ')}
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Confirmation Dialog - Keeping same style */}
                <Dialog
                    open={confirmDialog.open}
                    onClose={() => setConfirmDialog({ open: false, action: null })}
                    PaperProps={{
                        sx: {
                            bgcolor: 'background.paper',
                            color: 'text.primary',
                            border: '1px solid',
                            borderColor: 'divider',
                            minWidth: 400
                        }
                    }}
                >
                    <DialogTitle sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
                        {confirmDialog.action === 'register' ? 'Xác nhận đăng ký' : 'Xác nhận hủy'}
                    </DialogTitle>
                    <DialogContent sx={{ mt: 3 }}>
                        <Typography sx={{ color: 'text.secondary', fontSize: '1.1rem' }}>
                            {confirmDialog.action === 'register'
                                ? 'Bạn có chắc chắn muốn đăng ký tham gia sự kiện này?'
                                : 'Bạn có chắc chắn muốn hủy đăng ký sự kiện này?'}
                        </Typography>
                    </DialogContent>
                    <DialogActions sx={{ p: 3 }}>
                        <Button
                            onClick={() => setConfirmDialog({ open: false, action: null })}
                            sx={{ color: 'text.secondary', mr: 2 }}
                        >
                            Hủy
                        </Button>
                        <Button
                            onClick={confirmDialog.action === 'register' ? handleRegister : handleCancelRegistration}
                            variant="contained"
                            color={confirmDialog.action === 'register' ? 'primary' : 'error'}
                            disabled={registering}
                            sx={{
                                px: 4,
                                background: confirmDialog.action === 'register' ? 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)' : undefined
                            }}
                        >
                            {registering ? <CircularProgress size={20} color="inherit" /> : 'Xác nhận'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
};

export default EventDetailPage;