import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useThemeContext } from '../context/ThemeContext';
import {
    Container,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    CircularProgress,
    Divider,
    Tabs,
    Tab,
    Paper,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Chip,
    IconButton
} from '@mui/material';
import { dashboardApi } from '../api/dashboardApi';
import { registrationAPI } from '../api/registrationApi';
import EventCard from '../components/event/EventCard';
import {
    Assessment,
    Event,
    People,
    TrendingUp,
    NewReleases,
    Upcoming,
    ArrowForward,
    EventAvailable,
    AccessTime
} from '@mui/icons-material';
import { format } from 'date-fns';

/**
 * Component hiển thị thẻ thống kê.
 * Sử dụng để hiển thị các con số quan trọng (số lượng event, user, registration).
 */
const StatCard = ({ title, value, icon, color }) => {
    const { glassSx } = useThemeContext();
    return (
        <Card sx={{
            height: '100%',
            ...glassSx,
            color: 'text.primary',
            transition: 'all 0.3s ease',
            cursor: 'default',
            '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                borderColor: `${color}.main`
            }
        }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
                <Box sx={{
                    p: 2,
                    borderRadius: '12px',
                    bgcolor: `${color}.main`,
                    color: 'white',
                    mr: 3,
                    display: 'flex',
                    boxShadow: `0 4px 20px -5px ${color}`
                }}>
                    {icon}
                </Box>
                <Box>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                        {title}
                    </Typography>
                    <Typography variant="h4" fontWeight="800" sx={{ color: 'text.primary' }}>
                        {value}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

/**
 * Trang Dashboard chính.
 * Hiển thị thống kê cho Admin/Manager.
 * Hiển thị danh sách sự kiện và hoạt động cá nhân cho Volunteer.
 */
const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { glassSx } = useThemeContext();
    const [stats, setStats] = useState(null);
    const [myRegistrations, setMyRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tabValue, setTabValue] = useState(0);

    // Fetch dữ liệu dashboard khi component mount hoặc user thay đổi
    useEffect(() => {
        if (!user) {
            navigate('/auth/login');
            return;
        }

        const fetchData = async () => {
            try {
                const [dashboardData, registrationData] = await Promise.all([
                    dashboardApi.getStats(),
                    user.role === 'VOLUNTEER' ? registrationAPI.getMyRegistrations() : Promise.resolve({ data: [] })
                ]);

                setStats(dashboardData.data);
                setMyRegistrations(registrationData.data);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user, navigate]);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    if (!user) return null;

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8, minHeight: '100vh', alignItems: 'center' }}>
                <CircularProgress size={60} thickness={4} sx={{ color: 'primary.main' }} />
            </Box>
        );
    }

    // Lọc sự kiện hiển thị theo tab
    const currentEvents = stats ? (
        tabValue === 0 ? stats.discussedEvents :
            tabValue === 1 ? stats.newEvents :
                stats.upcomingEvents
    ) : [];

    return (
        <Box sx={{ minHeight: '100vh', pb: 8 }}>
            {/* Background Decoration */}
            <Box sx={{
                position: 'fixed',
                top: -100,
                right: -100,
                width: 500,
                height: 500,
                background: 'radial-gradient(circle, rgba(254,107,139,0.1) 0%, rgba(0,0,0,0) 70%)',
                zIndex: 0,
                pointerEvents: 'none'
            }} />
            <Box sx={{
                position: 'fixed',
                top: 200,
                left: -100,
                width: 400,
                height: 400,
                background: 'radial-gradient(circle, rgba(255,142,83,0.1) 0%, rgba(0,0,0,0) 70%)',
                zIndex: 0,
                pointerEvents: 'none'
            }} />

            <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, py: 4 }}>
                {/* Hero Section */}
                <Box sx={{ mb: 5 }}>
                    <Grid container alignItems="center" spacing={3}>
                        <Grid item xs={12} md={8}>
                            <Typography variant="h3" fontWeight="800" sx={{ mb: 1 }}>
                                Xin chào, <Box component="span" sx={{
                                    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}>{user.fullName}</Box> 👋
                            </Typography>
                            <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 400 }}>
                                Hôm nay bạn muốn đóng góp gì cho cộng đồng?
                            </Typography>
                        </Grid>
                        {/* Summary Stats for Volunteer */}
                        {user.role === 'VOLUNTEER' && (
                            <Grid item xs={12} md={4} sx={{ display: 'flex', gap: 2 }}>
                                <Paper sx={{ ...glassSx, p: 2, flex: 1, textAlign: 'center', borderRadius: 4 }}>
                                    <Typography variant="h4" fontWeight="bold" color="primary.main">
                                        {myRegistrations.length}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">Sự kiện đã đăng ký</Typography>
                                </Paper>
                            </Grid>
                        )}
                    </Grid>
                </Box>

                {/* Admin/Manager Detailed Stats */}
                {(user.role === 'ADMIN' || user.role === 'EVENT_MANAGER') && stats && (
                    <Grid container spacing={3} sx={{ mb: 6 }}>
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <StatCard
                                title="Tổng sự kiện"
                                value={stats.totalEvents}
                                icon={<Event fontSize="large" />}
                                color="primary"
                            />
                        </Grid>
                        {user.role === 'ADMIN' && (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                <StatCard
                                    title="Thành viên"
                                    value={stats.totalUsers}
                                    icon={<People fontSize="large" />}
                                    color="info"
                                />
                            </Grid>
                        )}
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <StatCard
                                title="Lượt đăng ký"
                                value={stats.totalRegistrations || 0}
                                icon={<Assessment fontSize="large" />}
                                color="success"
                            />
                        </Grid>
                    </Grid>
                )}

                <Grid container spacing={4}>
                    {/* Main Content - Event Tabs */}
                    <Grid size={{ xs: 12, lg: user.role === 'VOLUNTEER' ? 8 : 12 }}>
                        <Box sx={{ mb: 3 }}>
                            <Tabs
                                value={tabValue}
                                onChange={handleTabChange}
                                aria-label="event tabs"
                                sx={{
                                    '& .MuiTabs-indicator': {
                                        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                                        height: 3,
                                        borderRadius: 3
                                    },
                                    '& .MuiTab-root': {
                                        textTransform: 'none',
                                        fontSize: '1rem',
                                        fontWeight: 600,
                                        mr: 2,
                                        color: 'text.secondary',
                                        '&.Mui-selected': {
                                            color: 'primary.main',
                                        }
                                    }
                                }}
                            >
                                <Tab icon={<TrendingUp />} iconPosition="start" label="Đang quan tâm" />
                                <Tab icon={<NewReleases />} iconPosition="start" label="Mới nhất" />
                                <Tab icon={<Upcoming />} iconPosition="start" label="Sắp diễn ra" />
                            </Tabs>
                        </Box>

                        <Grid container spacing={3}>
                            {currentEvents && currentEvents.length > 0 ? (
                                currentEvents.map(event => (
                                    <Grid key={event.id} size={{ xs: 12, sm: 6 }}>
                                        <EventCard
                                            event={event}
                                            registration={myRegistrations.find(r => r.eventId === event.id)}
                                        />
                                    </Grid>
                                ))
                            ) : (
                                <Grid size={{ xs: 12 }}>
                                    <Box sx={{ textAlign: 'center', py: 8, opacity: 0.6 }}>
                                        <EventAvailable sx={{ fontSize: 60, mb: 2, color: 'text.disabled' }} />
                                        <Typography>Chưa có sự kiện nào trong mục này.</Typography>
                                    </Box>
                                </Grid>
                            )}
                        </Grid>
                    </Grid>

                    {/* Sidebar - My Activities (Volunteer Only) */}
                    {user.role === 'VOLUNTEER' && (
                        <Grid size={{ xs: 12, lg: 4 }}>
                            <Paper sx={{
                                ...glassSx,
                                p: 3,
                                borderRadius: '24px',
                                position: 'sticky',
                                top: 100
                            }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                    <Typography variant="h6" fontWeight="bold">
                                        Hoạt động của tôi
                                    </Typography>
                                    {myRegistrations.length > 0 && (
                                        <Chip label={`${myRegistrations.length}`} size="small" color="primary" />
                                    )}
                                </Box>

                                {myRegistrations.length > 0 ? (
                                    <List>
                                        {myRegistrations.slice(0, 5).map((reg) => (
                                            <ListItem
                                                key={reg.id}
                                                disableGutters
                                                secondaryAction={
                                                    <IconButton edge="end" size="small" onClick={() => navigate(`/events/${reg.eventId}`)}>
                                                        <ArrowForward fontSize="small" />
                                                    </IconButton>
                                                }
                                                sx={{
                                                    mb: 2,
                                                    bgcolor: 'action.hover',
                                                    borderRadius: 3,
                                                    p: 1.5,
                                                    transition: 'transform 0.2s',
                                                    '&:hover': { transform: 'translateX(5px)', bgcolor: 'action.selected' }
                                                }}
                                            >
                                                <ListItemAvatar>
                                                    <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                                                        <EventAvailable fontSize="small" />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={
                                                        <Typography variant="subtitle2" fontWeight="600" noWrap>
                                                            {reg.eventName || "Sự kiện #" + reg.eventId}
                                                        </Typography>
                                                    }
                                                    secondaryTypographyProps={{ component: 'div' }}
                                                    secondary={
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                                            <Chip
                                                                label={reg.status}
                                                                size="small"
                                                                sx={{ height: 16, fontSize: '0.6rem' }}
                                                                color={reg.status === 'APPROVED' ? 'success' : reg.status === 'PENDING' ? 'warning' : 'default'}
                                                            />
                                                        </Box>
                                                    }
                                                />
                                            </ListItem>
                                        ))}
                                        {myRegistrations.length > 5 && (
                                            <Box sx={{ textAlign: 'center', mt: 2 }}>
                                                <Typography variant="body2" color="primary" sx={{ cursor: 'pointer', fontWeight: 600 }}>
                                                    Xem tất cả
                                                </Typography>
                                            </Box>
                                        )}
                                    </List>
                                ) : (
                                    <Box sx={{ textAlign: 'center', py: 4 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            Bạn chưa đăng ký sự kiện nào.
                                        </Typography>
                                        <Typography variant="body2" color="primary" sx={{ mt: 1, cursor: 'pointer' }} onClick={() => setTabValue(0)}>
                                            Tìm sự kiện ngay
                                        </Typography>
                                    </Box>
                                )}
                            </Paper>
                        </Grid>
                    )}
                </Grid>
            </Container>
        </Box>
    );
};

export default Dashboard;