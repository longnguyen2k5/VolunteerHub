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

    const handleCardClick = () => {
        if (!user) {
            toast.info("Vui lòng đăng nhập để xem chi tiết sự kiện!");
            return;
        }
        navigate(`/events/${event.id}`);
    };

    return (
        <Card
            onClick={handleCardClick}
            sx={{
                height: 320,
                width: '100%',
                position: 'relative',
                borderRadius: '20px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                    '& .hover-panel-left': { transform: 'translateX(0)', opacity: 1 },
                    '& .hover-panel-right': { transform: 'translateX(0)', opacity: 1 },
                    '& .card-content-overlay': { transform: 'translateY(100%)', opacity: 0 }, // Optional: Hide title on hover to show details clearly? Or keep it? Let's keep it visible but maybe move it. Actually, if panels cover everything, let's fade out the original bottom title.
                    '& .bg-image': { transform: 'scale(1.1)' }
                }
            }}
        >
            {/* Background Image */}
            <CardMedia
                className="bg-image"
                component="img"
                image={event.imageUrl || DEFAULT_IMAGE}
                alt={event.name}
                sx={{
                    height: '100%',
                    width: '100%',
                    objectFit: 'cover',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    zIndex: 0,
                    transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = DEFAULT_IMAGE;
                }}
            />

            {/* Gradient Overlay for Title (Always visible initially) */}
            <Box
                className="card-content-overlay"
                sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: '50%',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 60%, transparent 100%)',
                    zIndex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    p: 2,
                    transition: 'all 0.3s ease',
                }}
            >
                <Box sx={{ mb: 1, display: 'flex', gap: 1 }}>
                    <Chip
                        label={
                            (registration && registration.status !== 'CANCELLED') ? getStatusText(registration.status) :
                                (new Date(event.endTime) < new Date()) ? 'Đã kết thúc' :
                                    (event.currentParticipants >= event.maxParticipants) ? 'Đủ người' :
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
                        sx={{ fontWeight: 600, height: 24 }}
                    />
                </Box>
                <Typography
                    variant="h6"
                    sx={{
                        color: 'white',
                        fontWeight: 700,
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        lineHeight: 1.3
                    }}
                >
                    {event.name}
                </Typography>
            </Box>

            {/* Left Hover Panel */}
            <Box className="hover-panel-left" sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '55%', // Slightly more than half to blend well
                height: '100%',
                background: 'linear-gradient(90deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,0) 100%)', // Fades to transparent
                transform: 'translateX(-100%)',
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                p: 3,
                zIndex: 2,
                opacity: 0,
            }}>
                <Box sx={{ color: 'white', transform: 'translateX(0)', transition: 'transform 0.4s 0.1s' }}>
                    <Typography variant="overline" sx={{ color: 'primary.light', fontWeight: 700, letterSpacing: 1.5 }}>
                        Thời gian & Địa điểm
                    </Typography>
                    <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', mb: 1 }}>
                        <CalendarToday fontSize="small" sx={{ mr: 1.5, color: 'white', opacity: 0.8 }} />
                        <Typography variant="body2" fontWeight="500">
                            {format(new Date(event.startTime), 'HH:mm dd/MM/yyyy')}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <LocationOn fontSize="small" sx={{ mr: 1.5, color: 'white', opacity: 0.8, mt: 0.3 }} />
                        <Typography variant="body2" fontWeight="500" sx={{ lineHeight: 1.4 }}>
                            {event.location}
                        </Typography>
                    </Box>
                </Box>
            </Box>

            {/* Right Hover Panel */}
            <Box className="hover-panel-right" sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '55%',
                height: '100%',
                background: 'linear-gradient(270deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,0) 100%)',
                transform: 'translateX(100%)',
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-end', // Align text to right for this panel
                p: 3,
                zIndex: 2,
                opacity: 0,
                textAlign: 'right'
            }}>
                <Box sx={{ color: 'white' }}>
                    <Typography variant="overline" sx={{ color: 'secondary.light', fontWeight: 700, letterSpacing: 1.5 }}>
                        Thông tin
                    </Typography>
                    <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mb: 1 }}>
                        <Typography variant="body2" fontWeight="500" sx={{ mr: 1.5 }}>
                            {event.currentParticipants || 0}/{event.maxParticipants} người
                        </Typography>
                        <People fontSize="small" sx={{ color: 'white', opacity: 0.8 }} />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <Typography variant="body2" fontWeight="500" sx={{ mr: 1.5 }}>
                            {event.managerName || "Ẩn danh"}
                        </Typography>
                        <Person fontSize="small" sx={{ color: 'white', opacity: 0.8 }} />
                    </Box>
                </Box>
            </Box>

            {/* Category Chip (Top Right, Always Visible) */}
            <Box sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                zIndex: 3
            }}>
                <Chip
                    label={CATEGORY_LABELS[event.category] || event.category || 'Chung'}
                    size="small"
                    sx={{
                        bgcolor: 'rgba(0,0,0,0.7)',
                        backdropFilter: 'blur(4px)',
                        color: 'white',
                        border: '1px solid rgba(255,255,255,0.2)',
                        fontWeight: 600,
                        height: 24,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}
                />
            </Box>
        </Card>
    );
};

export default EventCard;