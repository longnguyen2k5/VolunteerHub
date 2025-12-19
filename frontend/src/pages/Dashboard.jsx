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
    <Card sx={{ height: '100%' }}>
        <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
            <Box sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: `${color}.light`,
                color: `${color}.main`,
                mr: 3
            }}>
                {icon}
            </Box>
            <Box>
                <Typography color="text.secondary" variant="body2">
                    {title}
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                    {value}
                </Typography>
            </Box>
        </CardContent>
    </Card>
);

const SectionHeader = ({ title }) => (
    <Box sx={{ mb: 3, mt: 5, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h5" fontWeight="bold" color="primary">
            {title}
        </Typography>
        <Divider sx={{ ml: 2, flexGrow: 1 }} />
    </Box>
);

const EventListSection = ({ title, events, registrations }) => {
    if (!events || events.length === 0) return null;
    return (
        <Box>
            <SectionHeader title={title} />
            <Grid container spacing={3}>
                {events.map(event => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={event.id}>
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
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom fontWeight="bold">
                    Xin chào, {user.fullName}! 👋
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Chào mừng bạn quay trở lại VolunteerHub
                </Typography>
            </Box>

            {/* Admin / Manager Stats */}
            {(user.role === 'ADMIN' || user.role === 'EVENT_MANAGER') && stats && (
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={4}>
                        <StatCard
                            title="Tổng sự kiện"
                            value={stats.totalEvents}
                            icon={<Event fontSize="large" />}
                            color="primary"
                        />
                    </Grid>
                    {user.role === 'ADMIN' && (
                        <Grid item xs={12} md={4}>
                            <StatCard
                                title="Tổng thành viên"
                                value={stats.totalUsers}
                                icon={<People fontSize="large" />}
                                color="info"
                            />
                        </Grid>
                    )}
                    <Grid item xs={12} md={4}>
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
    );
};

export default Dashboard;