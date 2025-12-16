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

const EventDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [registering, setRegistering] = useState(false);
    const [myRegistration, setMyRegistration] = useState(null);
    const [confirmDialog, setConfirmDialog] = useState({ open: false, action: null });

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
        if (myRegistration) return false;
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

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!event) return null;

    return (
        <Container sx={{ py: 4 }}>
            <Button
                startIcon={<ArrowBack />}
                onClick={() => navigate('/events')}
                sx={{ mb: 3 }}
            >
                Quay lại
            </Button>

            <Grid container spacing={4}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <Card>
                        <CardContent sx={{ p: 4 }}>
                            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                                <Chip
                                    label={CATEGORY_LABELS[event.category] || event.category || 'Chung'}
                                    color="primary"
                                    variant="outlined"
                                />
                                <Chip
                                    label={
                                        (myRegistration && myRegistration.status !== 'CANCELLED') ? getStatusText(myRegistration.status) :
                                            (new Date(event.endTime) < new Date()) ? 'Đã kết thúc' :
                                                (event.currentParticipants >= event.maxParticipants) ? 'Đã đủ người' :
                                                    (new Date(event.startTime) <= new Date()) ? 'Đang diễn ra' :
                                                        'Sắp diễn ra'
                                    }
                                    color={
                                        (myRegistration && myRegistration.status !== 'CANCELLED') ? getStatusColor(myRegistration.status) :
                                            (new Date(event.endTime) < new Date()) ? 'default' :
                                                (event.currentParticipants >= event.maxParticipants) ? 'error' :
                                                    (new Date(event.startTime) <= new Date()) ? 'secondary' :
                                                        'info'
                                    }
                                />
                            </Box>

                            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
                                {event.name}
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3, flexWrap: 'wrap' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <CalendarToday sx={{ mr: 1, color: 'primary.main' }} />
                                    <Box>
                                        <Typography variant="body2" color="text.secondary">
                                            Bắt đầu
                                        </Typography>
                                        <Typography variant="body1" fontWeight={500}>
                                            {format(new Date(event.startTime), 'dd/MM/yyyy HH:mm', { locale: vi })}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <CalendarToday sx={{ mr: 1, color: 'error.main' }} />
                                    <Box>
                                        <Typography variant="body2" color="text.secondary">
                                            Kết thúc
                                        </Typography>
                                        <Typography variant="body1" fontWeight={500}>
                                            {format(new Date(event.endTime), 'dd/MM/yyyy HH:mm', { locale: vi })}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />
                                <Typography variant="body1">
                                    {event.location}
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <People sx={{ mr: 1, color: 'text.secondary' }} />
                                <Typography variant="body1">
                                    {event.currentParticipants}/{event.maxParticipants} người tham gia
                                </Typography>
                            </Box>

                            <Divider sx={{ my: 3 }} />

                            <Typography variant="h6" gutterBottom>
                                Mô tả chi tiết
                            </Typography>
                            <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line' }}>
                                {event.description}
                            </Typography>

                            <Divider sx={{ my: 3 }} />

                            <Typography variant="body2" color="text.secondary">
                                Được tổ chức bởi: <strong>{event.managerName}</strong>
                            </Typography>

                            {/* Channel Button */}
                            {event.status === 'APPROVED' && (myRegistration?.status === 'APPROVED' || myRegistration?.status === 'COMPLETED') && (
                                <Box sx={{ mt: 3 }}>
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        startIcon={<Forum />}
                                        onClick={() => navigate(`/events/${id}/channel`)}
                                    >
                                        Vào kênh trao đổi
                                    </Button>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{ position: 'sticky', top: 20 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Đăng ký tham gia
                            </Typography>

                            {myRegistration ? (
                                <Box>
                                    <Chip
                                        label={`Trạng thái: ${getStatusText(myRegistration.status)}`}
                                        color={getStatusColor(myRegistration.status)}
                                        sx={{ mb: 2 }}
                                    />
                                    <Typography variant="body2" color="text.secondary" paragraph>
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
                                        >
                                            Hủy đăng ký
                                        </Button>
                                    )}
                                </Box>
                            ) : (
                                <Box>
                                    {canRegister() ? (
                                        <>
                                            <Typography variant="body2" color="text.secondary" paragraph>
                                                Bạn có muốn tham gia sự kiện này không?
                                            </Typography>
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                size="large"
                                                startIcon={<PersonAdd />}
                                                onClick={() => setConfirmDialog({ open: true, action: 'register' })}
                                                disabled={registering}
                                            >
                                                {registering ? <CircularProgress size={24} /> : 'Đăng ký ngay'}
                                            </Button>
                                        </>
                                    ) : (
                                        <Typography variant="body2" color="text.secondary">
                                            {[
                                                !user && 'Vui lòng đăng nhập để đăng ký',
                                                user?.role !== 'VOLUNTEER' && 'Chỉ tình nguyện viên mới có thể đăng ký',
                                                event.currentParticipants >= event.maxParticipants && 'Đã đủ người tham gia',
                                                new Date(event.endTime) < new Date() ? 'Sự kiện đã kết thúc' : (new Date(event.startTime) < new Date() && 'Sự kiện đã bắt đầu'),
                                                event.status !== 'APPROVED' && 'Sự kiện chưa được duyệt'
                                            ].filter(Boolean).join(' | ')}
                                        </Typography>
                                    )}
                                </Box>
                            )}

                            <Divider sx={{ my: 2 }} />

                            <Box>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    Số chỗ còn lại
                                </Typography>
                                <Typography variant="h4" color="primary">
                                    {event.maxParticipants - event.currentParticipants}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Confirmation Dialog */}
            <Dialog
                open={confirmDialog.open}
                onClose={() => setConfirmDialog({ open: false, action: null })}
            >
                <DialogTitle>
                    {confirmDialog.action === 'register' ? 'Xác nhận đăng ký' : 'Xác nhận hủy'}
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        {confirmDialog.action === 'register'
                            ? 'Bạn có chắc chắn muốn đăng ký tham gia sự kiện này?'
                            : 'Bạn có chắc chắn muốn hủy đăng ký sự kiện này?'}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDialog({ open: false, action: null })}>
                        Hủy
                    </Button>
                    <Button
                        onClick={confirmDialog.action === 'register' ? handleRegister : handleCancelRegistration}
                        variant="contained"
                        color={confirmDialog.action === 'register' ? 'primary' : 'error'}
                        disabled={registering}
                    >
                        {registering ? <CircularProgress size={20} /> : 'Xác nhận'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default EventDetailPage;