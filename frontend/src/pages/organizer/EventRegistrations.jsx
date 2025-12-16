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
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    IconButton,
    CircularProgress,
    Stack,
    Tooltip,
} from '@mui/material';
import {
    ArrowBack,
    CheckCircle,
    Cancel,
    Done,
    TaskAlt,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { registrationAPI } from '../../api/registrationApi';
import { eventAPI } from '../../api/eventApi';

const EventRegistrations = () => {
    const { id } = useParams();
    const navigate = useNavigate();
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
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Button
                startIcon={<ArrowBack />}
                onClick={() => navigate('/events/manage')}
                sx={{ mb: 3 }}
            >
                Quay lại danh sách
            </Button>

            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Quản lý đăng ký
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Sự kiện: <strong>{event?.name}</strong>
                </Typography>
                <Typography variant="body2">
                    Tổng số đăng ký: {registrations.length} | Đã duyệt: {registrations.filter(r => r.status === 'APPROVED').length}
                </Typography>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>STT</TableCell>
                            <TableCell>Tên Tình nguyện viên</TableCell>
                            <TableCell>Ngày đăng ký</TableCell>
                            <TableCell>Trạng thái</TableCell>
                            <TableCell align="center">Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {registrations.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center">Chưa có lượt đăng ký nào</TableCell>
                            </TableRow>
                        ) : (
                            registrations.map((reg, index) => (
                                <TableRow key={reg.id} hover>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>
                                        <Typography variant="body1" fontWeight="medium">
                                            {reg.userName}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
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
                                                                color="success"
                                                                onClick={() => handleAction(reg.id, 'approve')}
                                                                disabled={processing === reg.id}
                                                            >
                                                                <Done />
                                                            </IconButton>
                                                        </span>
                                                    </Tooltip>
                                                    <Tooltip title="Từ chối">
                                                        <span>
                                                            <IconButton
                                                                color="error"
                                                                onClick={() => handleAction(reg.id, 'reject')}
                                                                disabled={processing === reg.id}
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
                                                            color="info"
                                                            onClick={() => handleAction(reg.id, 'complete')}
                                                            disabled={processing === reg.id}
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
