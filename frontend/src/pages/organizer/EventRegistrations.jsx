import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    Grid,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    IconButton,
    CircularProgress,
    Stack,
    Tooltip,
    Card,
    CardContent,
} from '@mui/material';
import {
    ArrowBack,
    CheckCircle,
    Cancel,
    Done,
    TaskAlt,
    FileDownload,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { registrationAPI } from '../../api/registrationApi';
import { eventAPI } from '../../api/eventApi';

import { useThemeContext } from '../../context/ThemeContext';

/**
 * Trang quản lý đăng ký của một sự kiện cụ thể (dành cho Event Manager).
 * Hiển thị danh sách tình nguyện viên đăng ký, cho phép duyệt/từ chối/xác nhận hoàn thành tham gia.
 */
const EventRegistrations = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { glassSx } = useThemeContext(); // Get glass styles
    const [registrations, setRegistrations] = useState([]);
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(null); // ID of registration being processed

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [regResponse, eventResponse] = await Promise.all([
                registrationAPI.getEventRegistrations(id),
                eventAPI.getById(id)
            ]);
            setRegistrations(regResponse.data);
            setEvent(eventResponse.data);
        } catch (error) {
            toast.error('Không thể tải dữ liệu đăng ký');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Xử lý các hành động: Duyệt, Từ chối, Hoàn thành
    const handleAction = async (registrationId, action) => {
        setProcessing(registrationId);
        try {
            if (action === 'approve') {
                await registrationAPI.approveRegistration(registrationId);
                toast.success('Đã duyệt đăng ký');
            } else if (action === 'reject') {
                await registrationAPI.rejectRegistration(registrationId);
                toast.success('Đã từ chối đăng ký');
            } else if (action === 'complete') {
                await registrationAPI.markAsCompleted(registrationId);
                toast.success('Đã xác nhận hoàn thành');
            }
            // Reload list
            const response = await registrationAPI.getEventRegistrations(id);
            setRegistrations(response.data);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
        } finally {
            setProcessing(null);
        }
    };

    const handleExport = async () => {
        try {
            const blob = await registrationAPI.exportEventRegistrations(id);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `registrations_event_${id}.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            toast.success('Xuất dữ liệu thành công');
        } catch (error) {
            toast.error('Không thể xuất dữ liệu: ' + (error.message || 'Lỗi không xác định'));
        }
    };

    const getStatusChip = (status) => {
        const config = {
            PENDING: { label: 'Chờ duyệt', color: 'warning' },
            APPROVED: { label: 'Đã duyệt', color: 'success' },
            REJECTED: { label: 'Từ chối', color: 'error' },
            COMPLETED: { label: 'Hoàn thành', color: 'info' },
            CANCELLED: { label: 'Đã hủy', color: 'default' },
        };
        const item = config[status] || { label: status, color: 'default' };
        return <Chip label={item.label} color={item.color} size="small" />;
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 10, minHeight: '80vh' }}>
            <Button
                startIcon={<ArrowBack />}
                onClick={() => navigate('/events/manage')}
                sx={{
                    mb: 4,
                    color: 'text.secondary',
                    '&:hover': { color: 'text.primary', bgcolor: 'action.hover' }
                }}
            >
                Quay lại danh sách
            </Button>

            <Box sx={{ mb: 5 }}>
                <Typography
                    variant="h3"
                    gutterBottom
                    sx={{
                        fontWeight: 800,
                        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    Quản lý đăng ký
                </Typography>
                <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 400 }}>
                    Sự kiện: <strong style={{ color: '#FF8E53' }}>{event?.name}</strong>
                </Typography>
            </Box>

            {/* Statistics Cards */}
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mb: 5 }}>
                <Card sx={{ flex: 1, ...glassSx, color: 'text.primary' }}>
                    <CardContent>
                        <Typography color="text.secondary" gutterBottom fontWeight={500}>
                            Tổng số đăng ký
                        </Typography>
                        <Typography variant="h3" fontWeight={700}>
                            {registrations.length}
                        </Typography>
                    </CardContent>
                </Card>
                <Card sx={{ flex: 1, ...glassSx, color: 'text.primary' }}>
                    <CardContent>
                        <Typography color="text.secondary" gutterBottom fontWeight={500}>
                            Đã duyệt
                        </Typography>
                        <Typography variant="h3" sx={{ color: '#66bb6a', fontWeight: 700 }}>
                            {registrations.filter(r => r.status === 'APPROVED' || r.status === 'COMPLETED').length}
                        </Typography>
                    </CardContent>
                </Card>
                <Card sx={{ flex: 1, ...glassSx, color: 'text.primary' }}>
                    <CardContent>
                        <Typography color="text.secondary" gutterBottom fontWeight={500}>
                            Tỷ lệ hoàn thành
                        </Typography>
                        <Typography variant="h3" sx={{ color: '#29b6f6', fontWeight: 700 }}>
                            {(() => {
                                const approved = registrations.filter(r => r.status === 'APPROVED' || r.status === 'COMPLETED').length;
                                const completed = registrations.filter(r => r.status === 'COMPLETED').length;
                                return approved > 0 ? Math.round((completed / approved) * 100) + '%' : '0%';
                            })()}
                        </Typography>
                    </CardContent>
                </Card>
            </Stack>

            {/* Toolbar with Export */}
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button
                    variant="outlined"
                    startIcon={<FileDownload />}
                    onClick={handleExport}
                    sx={{
                        color: '#FF8E53',
                        borderColor: 'rgba(255, 142, 83, 0.5)',
                        borderRadius: '20px',
                        px: 3,
                        '&:hover': {
                            borderColor: '#FF8E53',
                            bgcolor: 'rgba(255, 142, 83, 0.1)'
                        }
                    }}
                >
                    Xuất CSV
                </Button>
            </Box>

            <TableContainer
                component={Paper}
                sx={{
                    ...glassSx,
                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
                }}
            >
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: 'action.hover' }}>
                            <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>STT</TableCell>
                            <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Tên Tình nguyện viên</TableCell>
                            <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Ngày đăng ký</TableCell>
                            <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Trạng thái</TableCell>
                            <TableCell align="center" sx={{ color: 'text.secondary', fontWeight: 600 }}>Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {registrations.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 5, color: 'text.secondary' }}>Chưa có lượt đăng ký nào</TableCell>
                            </TableRow>
                        ) : (
                            registrations.map((reg, index) => (
                                <TableRow
                                    key={reg.id}
                                    hover
                                    sx={{
                                        '&:hover': { bgcolor: 'action.hover' },
                                        transition: 'background-color 0.2s',
                                        borderBottom: '1px solid',
                                        borderColor: 'divider',
                                    }}
                                >
                                    <TableCell sx={{ color: 'text.secondary' }}>{index + 1}</TableCell>
                                    <TableCell>
                                        <Typography variant="body1" fontWeight={600} sx={{ color: 'text.primary' }}>
                                            {reg.userName}
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{ color: 'text.secondary' }}>
                                        {format(new Date(reg.registeredAt), 'dd/MM/yyyy HH:mm')}
                                    </TableCell>
                                    <TableCell>{getStatusChip(reg.status)}</TableCell>
                                    <TableCell align="center">
                                        <Stack direction="row" spacing={1} justifyContent="center">
                                            {reg.status === 'PENDING' && (
                                                <>
                                                    <Tooltip title="Duyệt">
                                                        <span>
                                                            <IconButton
                                                                onClick={() => handleAction(reg.id, 'approve')}
                                                                disabled={processing === reg.id}
                                                                sx={{
                                                                    color: '#66bb6a',
                                                                    bgcolor: 'rgba(102, 187, 106, 0.1)',
                                                                    '&:hover': { bgcolor: 'rgba(102, 187, 106, 0.2)' }
                                                                }}
                                                            >
                                                                <Done />
                                                            </IconButton>
                                                        </span>
                                                    </Tooltip>
                                                    <Tooltip title="Từ chối">
                                                        <span>
                                                            <IconButton
                                                                onClick={() => handleAction(reg.id, 'reject')}
                                                                disabled={processing === reg.id}
                                                                sx={{
                                                                    color: '#ef5350',
                                                                    bgcolor: 'rgba(239, 83, 80, 0.1)',
                                                                    '&:hover': { bgcolor: 'rgba(239, 83, 80, 0.2)' }
                                                                }}
                                                            >
                                                                <Cancel />
                                                            </IconButton>
                                                        </span>
                                                    </Tooltip>
                                                </>
                                            )}
                                            {reg.status === 'APPROVED' && (
                                                <Tooltip title="Xác nhận hoàn thành">
                                                    <span>
                                                        <IconButton
                                                            onClick={() => handleAction(reg.id, 'complete')}
                                                            disabled={processing === reg.id}
                                                            sx={{
                                                                color: '#29b6f6',
                                                                bgcolor: 'rgba(41, 182, 246, 0.1)',
                                                                '&:hover': { bgcolor: 'rgba(41, 182, 246, 0.2)' }
                                                            }}
                                                        >
                                                            <TaskAlt />
                                                        </IconButton>
                                                    </span>
                                                </Tooltip>
                                            )}
                                            {['REJECTED', 'COMPLETED', 'CANCELLED'].includes(reg.status) && (
                                                <Typography variant="caption" color="text.secondary">
                                                    -
                                                </Typography>
                                            )}
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default EventRegistrations;
