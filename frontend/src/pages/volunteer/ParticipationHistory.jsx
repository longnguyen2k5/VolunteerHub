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

const ParticipationHistory = () => {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);

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
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" component="h1">
                    Lịch sử tham gia
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Danh sách các sự kiện bạn đã đăng ký tham gia
                </Typography>
            </Box>

            {registrations.length === 0 ? (
                <Alert severity="info">Bạn chưa đăng ký tham gia sự kiện nào.</Alert>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Tên sự kiện</TableCell>
                                <TableCell>Thời gian tổ chức</TableCell>
                                <TableCell>Địa điểm</TableCell>
                                <TableCell>Ngày đăng ký</TableCell>
                                <TableCell>Trạng thái</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {registrations.map((reg) => (
                                <TableRow key={reg.id} hover>
                                    <TableCell>
                                        <Typography variant="body1" fontWeight="medium">
                                            {reg.eventName}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        {formatDateTime(reg.eventStartTime)}
                                    </TableCell>
                                    <TableCell>{reg.eventLocation}</TableCell>
                                    <TableCell>{formatDateTime(reg.registeredAt)}</TableCell>
                                    <TableCell>{getStatusChip(reg.status)}</TableCell>
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
