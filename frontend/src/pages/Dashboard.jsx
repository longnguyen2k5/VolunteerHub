import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
    Container,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    CircularProgress,
    Divider
} from '@mui/material';
import { dashboardApi } from '../api/dashboardApi';
import { registrationAPI } from '../api/registrationApi';
import EventCard from '../components/event/EventCard';
import { Assessment, Event, People } from '@mui/icons-material';

const StatCard = ({ title, value, icon, color }) => (
    <Card sx={{
        height: '100%',
        bgcolor: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        color: 'white',
        transition: 'all 0.3s ease',
        '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            border: `1px solid ${color}.main` // Highlight border on hover
        }
    }}>
        <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
            <Box sx={{
                p: 2,
                borderRadius: '12px',
                bgcolor: 'rgba(255,255,255,0.1)',
                color: `${color}.light`,
                mr: 3,
                display: 'flex',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
            }}>
                {icon}
            </Box>
            <Box>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 0.5 }}>
                    {title}
                </Typography>
                <Typography variant="h4" fontWeight="bold" sx={{ color: 'white' }}>
                    {value}
                </Typography>
            </Box>
        </CardContent>
    </Card>
);

const SectionHeader = ({ title }) => (
    <Box sx={{ mb: 4, mt: 6, display: 'flex', alignItems: 'center' }}>
        <Typography
            variant="h5"
            fontWeight="bold"
            sx={{
                background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block'
            }}
        >
            {title}
        </Typography>
        <Divider sx={{ ml: 3, flexGrow: 1, borderColor: 'rgba(255,255,255,0.1)' }} />
    </Box>
);

const EventListSection = ({ title, events, registrations }) => {
    if (!events || events.length === 0) return null;
    return (
        <Box>
            <SectionHeader title={title} />
            <Grid container spacing={3}>
                {events.map(event => (
                    <Grid key={event.id} size={{ xs: 12, sm: 6, md: 4 }}>
                        <EventCard
                            event={event}
                            registration={registrations.find(r => r.eventId === event.id)}
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [myRegistrations, setMyRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);

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

    if (!user) return null;

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8, minHeight: '100vh', bgcolor: '#121212' }}>
                <CircularProgress sx={{ color: '#FF8E53' }} />
            </Box>
        );
    }

    return (
        <Box sx={{
            minHeight: '100vh',
            bgcolor: '#121212', // Base dark color
            color: 'white',
            pb: 8
        }}>
            {/* Background Accent */}
            <Box sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                height: '300px',
                background: 'radial-gradient(circle at 50% 0%, rgba(254, 107, 139, 0.15) 0%, rgba(18, 18, 18, 0) 70%)',
                zIndex: 0,
                pointerEvents: 'none'
            }} />

            <Container sx={{ position: 'relative', zIndex: 1, py: 4 }}>
                <Box sx={{ mb: 6, mt: 2 }}>
                    <Typography variant="h3" gutterBottom fontWeight="800">
                        Xin chào, <span style={{ color: '#FF8E53' }}>{user.fullName}</span>! 👋
                    </Typography>
                    <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 300 }}>
                        Chào mừng bạn quay trở lại VolunteerHub
                    </Typography>
                </Box>

                {/* Admin / Manager Stats */}
                {(user.role === 'ADMIN' || user.role === 'EVENT_MANAGER') && stats && (
                    <Grid container spacing={3} sx={{ mb: 6 }}>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <StatCard
                                title="Tổng sự kiện"
                                value={stats.totalEvents}
                                icon={<Event fontSize="large" />}
                                color="primary"
                            />
                        </Grid>
                        {user.role === 'ADMIN' && (
                            <Grid size={{ xs: 12, md: 4 }}>
                                <StatCard
                                    title="Tổng thành viên"
                                    value={stats.totalUsers}
                                    icon={<People fontSize="large" />}
                                    color="info"
                                />
                            </Grid>
                        )}
                        <Grid size={{ xs: 12, md: 4 }}>
                            <StatCard
                                title="Tổng lượt đăng ký"
                                value={stats.totalRegistrations || 0}
                                icon={<Assessment fontSize="large" />}
                                color="success"
                            />
                        </Grid>
                    </Grid>
                )}

                {/* Event Sections */}
                {stats && (
                    <>
                        <EventListSection
                            title="🔥 Sự kiện đang thu hút"
                            events={stats.discussedEvents}
                            registrations={myRegistrations}
                        />

                        <EventListSection
                            title="🆕 Sự kiện mới công bố"
                            events={stats.newEvents}
                            registrations={myRegistrations}
                        />

                        <EventListSection
                            title="📅 Sự kiện sắp diễn ra"
                            events={stats.upcomingEvents}
                            registrations={myRegistrations}
                        />
                    </>
                )}
            </Container>
        </Box>
    );
};

export default Dashboard;