import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Typography,
    Button,
    Chip,
    Box,
} from '@mui/material';
import {
    LocationOn,
    CalendarToday,
    People,
    Person,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useThemeContext } from '../../context/ThemeContext';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';

const EventCard = ({ event, registration }) => {
    const navigate = useNavigate();
    const { glassSx } = useThemeContext();
    const { user } = useAuth();

    const getStatusColor = (status) => {
        const colors = {
            PENDING: 'warning',
            APPROVED: 'success',
            REJECTED: 'error',
            COMPLETED: 'info',
        };
        return colors[status] || 'default';
    };

    const getStatusText = (status) => {
        const texts = {
            PENDING: 'Chờ duyệt',
            APPROVED: 'Đã duyệt',
            REJECTED: 'Từ chối',
            COMPLETED: 'Hoàn thành',
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

    const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1174";

    return (
        <Card sx={{
            height: '100%',
            width: '100%',
            minWidth: 0,
            maxWidth: '100%',
            display: 'flex',
            flexDirection: 'column',
            ...glassSx,
            borderRadius: '16px',
            color: 'text.primary',
            transition: 'all 0.3s ease',
            overflow: 'hidden',
            '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 12px 24px rgba(0,0,0,0.4)',
                bgcolor: 'action.hover',
            }
        }}>
            <Box sx={{ position: 'relative' }}>
                <CardMedia
                    component="img"
                    image={event.imageUrl || DEFAULT_IMAGE}
                    alt={event.name}
                    sx={{
                        height: 180,
                        objectFit: 'cover',
                        borderBottom: '1px solid',
                        borderColor: 'divider'
                    }}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = DEFAULT_IMAGE;
                    }}
                />
                <Box sx={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    display: 'flex',
                    gap: 1
                }}>
                    <Chip
                        label={CATEGORY_LABELS[event.category] || event.category || 'Chung'}
                        size="small"
                        sx={{
                            bgcolor: 'rgba(0,0,0,0.6)', // Keep dark overlay for contrast on image
                            backdropFilter: 'blur(4px)',
                            color: 'white',
                            border: '1px solid rgba(255,255,255,0.2)',
                            fontWeight: 600
                        }}
                    />
                </Box>
            </Box>

            <CardContent sx={{ flexGrow: 1, p: 2.5, minWidth: 0, overflow: 'hidden' }}>
                <Box sx={{ mb: 2 }}>
                    <Chip
                        label={
                            (registration && registration.status !== 'CANCELLED') ? getStatusText(registration.status) :
                                (new Date(event.endTime) < new Date()) ? 'Đã kết thúc' :
                                    (event.currentParticipants >= event.maxParticipants) ? 'Đã đủ người' :
                                        (new Date(event.startTime) <= new Date()) ? 'Đang diễn ra' :
                                            'Sắp diễn ra'
                        }
                        size="small"
                        color={
                            (registration && registration.status !== 'CANCELLED') ? getStatusColor(registration.status) :
                                (new Date(event.endTime) < new Date()) ? 'default' :
                                    (event.currentParticipants >= event.maxParticipants) ? 'error' :
                                        (new Date(event.startTime) <= new Date()) ? 'secondary' :
                                            'info'
                        }
                        sx={{ fontWeight: 600 }}
                    />
                </Box>

                <Typography
                    gutterBottom
                    variant="h6"
                    component="div"
                    sx={{
                        height: '3.2em',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        lineHeight: '1.2em',
                        fontWeight: 700,
                        mb: 1,
                        color: 'text.primary'
                    }}
                >
                    {event.name}
                </Typography>

                <Typography
                    variant="body2"
                    sx={{
                        color: 'text.secondary',
                        mb: 2,
                        height: '4.5em',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        lineHeight: '1.5em',
                        wordBreak: 'break-word'
                    }}
                >
                    {event.description}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5, minWidth: 0 }}>
                    <Person fontSize="small" sx={{ mr: 1.5, color: 'primary.main', fontSize: '1.2rem', flexShrink: 0, mt: 0.25 }} />
                    <Typography variant="body2" sx={{ color: 'text.secondary', wordBreak: 'break-word', minWidth: 0 }}>
                        {event.managerName || "Ẩn danh"}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5, minWidth: 0 }}>
                    <LocationOn fontSize="small" sx={{ mr: 1.5, color: 'primary.main', fontSize: '1.2rem', flexShrink: 0, mt: 0.25 }} />
                    <Typography variant="body2" sx={{ color: 'text.secondary', wordBreak: 'break-word', minWidth: 0 }}>
                        {event.location}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <CalendarToday fontSize="small" sx={{ mr: 1.5, color: 'primary.main', fontSize: '1.2rem' }} />
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {format(new Date(event.startTime), 'dd/MM/yyyy HH:mm')}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <People fontSize="small" sx={{ mr: 1.5, color: 'primary.main', fontSize: '1.2rem' }} />
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {event.currentParticipants || 0}/{event.maxParticipants} người
                    </Typography>
                </Box>
            </CardContent>

            <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                    size="medium"
                    onClick={() => {
                        if (!user) {
                            toast.info("Vui lòng đăng nhập để xem chi tiết sự kiện!");
                            return;
                        }
                        navigate(`/events/${event.id}`);
                    }}
                    fullWidth
                    variant="outlined"
                    sx={{
                        borderRadius: '20px',
                        borderColor: 'divider',
                        color: 'text.primary',
                        '&:hover': {
                            borderColor: 'primary.main',
                            bgcolor: 'action.hover',
                            color: 'primary.main'
                        }
                    }}
                >
                    Xem chi tiết
                </Button>
            </CardActions>
        </Card>
    );
};

export default EventCard;