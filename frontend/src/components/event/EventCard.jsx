import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Card,
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
} from '@mui/icons-material';
import { format } from 'date-fns';

const EventCard = ({ event }) => {
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

    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Chip
                        label={event.category || 'Chung'}
                        size="small"
                        color="primary"
                        variant="outlined"
                    />
                    <Chip
                        label={getStatusText(event.status)}
                        size="small"
                        color={getStatusColor(event.status)}
                    />
                </Box>

                <Typography gutterBottom variant="h6" component="div">
                    {event.title}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {event.description.length > 100
                        ? `${event.description.substring(0, 100)}...`
                        : event.description}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationOn fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                        {event.location}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CalendarToday fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                        {format(new Date(event.startDate), 'dd/MM/yyyy HH:mm')}
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