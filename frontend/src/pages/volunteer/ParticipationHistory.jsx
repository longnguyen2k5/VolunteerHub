import React, { useState, useEffect } from "react";
import {
    Container,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Box,
    CircularProgress,
    Alert,
} from "@mui/material";
import { format } from "date-fns";
import { registrationAPI } from "../../api/registrationApi";
import { toast } from "react-toastify";
import { useThemeContext } from "../../context/ThemeContext";

const ParticipationHistory = () => {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const { glassSx } = useThemeContext();

    useEffect(() => {
        loadRegistrations();
    }, []);

    const loadRegistrations = async () => {
        try {
            setLoading(true);
            const response = await registrationAPI.getMyRegistrations();
            setRegistrations(response.data || []);
        } catch (error) {
            toast.error("Không thể tải lịch sử tham gia");
            console.error("Error loading registrations:", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusChip = (status) => {
        const config = {
            PENDING: { label: "Chờ duyệt", color: "warning" },
            APPROVED: { label: "Đã duyệt", color: "info" },
            REJECTED: { label: "Bị từ chối", color: "error" },
            COMPLETED: { label: "Hoàn thành", color: "success" },
            CANCELLED: { label: "Đã hủy", color: "default" },
        };
        const item = config[status] || { label: status, color: "default" };
        return <Chip label={item.label} color={item.color} size="small" />;
    };

    const formatDateTime = (dateTime) => {
        if (!dateTime) return "";
        return format(new Date(dateTime), "dd/MM/yyyy HH:mm");
    };

    if (loading) {
        return (
            <Container
                maxWidth="lg"
                sx={{ mt: 4, display: "flex", justifyContent: "center" }}
            >
                <CircularProgress sx={{ color: 'primary.main' }} />
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 8, minHeight: '80vh' }}>
            <Box sx={{ mb: 5, textAlign: 'center' }}>
                <Typography
                    variant="h3"
                    component="h1"
                    sx={{
                        fontWeight: 800,
                        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        mb: 2
                    }}
                >
                    Lịch sử tham gia
                </Typography>
                <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 300 }}>
                    Hành trình đóng góp của bạn cho cộng đồng
                </Typography>
            </Box>

            {registrations.length === 0 ? (
                <Alert
                    severity="info"
                >
                    Bạn chưa đăng ký tham gia sự kiện nào. Hãy khám phá và tham gia ngay!
                </Alert>
            ) : (
                <TableContainer
                    component={Paper}
                    sx={{
                        ...glassSx,
                        borderRadius: '24px',
                        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                        overflowX: 'auto' // Enable horizontal scroll
                    }}
                >
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'action.hover' }}>
                                {[
                                    'Tên sự kiện',
                                    'Thời gian',
                                    'Địa điểm',
                                    'Ngày đăng ký',
                                    'Trạng thái'
                                ].map((head) => (
                                    <TableCell
                                        key={head}
                                        sx={{
                                            color: 'text.secondary',
                                            fontWeight: 600,
                                            borderBottom: '1px solid',
                                            borderColor: 'divider'
                                        }}
                                    >
                                        {head}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {registrations.map((reg) => (
                                <TableRow
                                    key={reg.id}
                                    hover
                                    sx={{
                                        '&:hover': { bgcolor: 'action.hover' },
                                        transition: 'background-color 0.2s',
                                        '& td': { borderColor: 'divider' }
                                    }}
                                >
                                    <TableCell sx={{ color: 'text.primary' }}>
                                        <Typography variant="body1" fontWeight={600} sx={{ color: 'primary.main' }}>
                                            {reg.eventName}
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{ color: 'text.secondary' }}>
                                        {formatDateTime(reg.eventStartTime)}
                                    </TableCell>
                                    <TableCell sx={{ color: 'text.secondary' }}>
                                        {reg.eventLocation}
                                    </TableCell>
                                    <TableCell sx={{ color: 'text.disabled' }}>
                                        {formatDateTime(reg.registeredAt)}
                                    </TableCell>
                                    <TableCell>
                                        {getStatusChip(reg.status)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Container>
    );
};

export default ParticipationHistory;
