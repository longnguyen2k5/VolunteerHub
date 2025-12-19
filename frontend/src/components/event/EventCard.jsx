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

const EventCard = ({ event, registration }) => {
    const navigate = useNavigate();

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
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardMedia
                component="img"
                image={event.imageUrl || DEFAULT_IMAGE}
                alt={event.name}
                sx={{ height: 140, objectFit: 'cover' }}
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = DEFAULT_IMAGE;
                }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Chip
                        label={CATEGORY_LABELS[event.category] || event.category || 'Chung'}
                        size="small"
                        color="primary"
                        variant="outlined"
                    />
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
                    />
                </Box>

                <Typography
                    gutterBottom
                    variant="h6"
                    component="div"
                    sx={{
                        height: '3.2em', // Fixed height for 2 lines approximately
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        lineHeight: '1.2em'
                    }}
                >
                    {event.name}
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        mb: 2,
                        height: '4.5em', // Fixed height for 3 lines (1.5 line height * 3)
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        lineHeight: '1.5em'
                    }}
                >
                    {event.description}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Person fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                        {event.managerName || "Ẩn danh"}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationOn fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                        {event.location}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CalendarToday fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                        {format(new Date(event.startTime), 'dd/MM/yyyy HH:mm')}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <People fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                        {event.currentParticipants || 0}/{event.maxParticipants} người
                    </Typography>
                </Box>
            </CardContent>

            <CardActions>
                <Button
                    size="small"
                    onClick={() => navigate(`/events/${event.id}`)}
                    fullWidth
                    variant="outlined"
                >
                    Xem chi tiết
                </Button>
            </CardActions>
        </Card>
    );
};

export default EventCard;