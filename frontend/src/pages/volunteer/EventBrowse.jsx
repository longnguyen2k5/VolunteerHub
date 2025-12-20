import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Grid,
    Box,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Paper,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import EventCard from '../../components/event/EventCard';
import { eventAPI } from '../../api/eventApi';
import { registrationAPI } from '../../api/registrationApi';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import { useThemeContext } from '../../context/ThemeContext';

const EventBrowse = () => {
    const CATEGORY_LABELS = {
        EDUCATION: "Giáo dục",
        ENVIRONMENT: "Môi trường",
        HEALTH: "Y tế",
        COMMUNITY: "Cộng đồng",
        EMERGENCY_RELIEF: "Cứu trợ khẩn cấp",
        OTHER: "Khác",
    };
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [startDate, setStartDate] = useState(''); // Filter: From Date
    const [endDate, setEndDate] = useState('');     // Filter: To Date
    const { glassSx } = useThemeContext();

    const [myRegistrations, setMyRegistrations] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        fetchEvents();
    }, []);

    useEffect(() => {
        filterEvents();
    }, [searchTerm, categoryFilter, startDate, endDate, events]);

    const fetchEvents = async () => {
        try {
            const response = await eventAPI.getAllApproved();
            setEvents(response.data);
            setFilteredEvents(response.data);

            if (user?.role === 'VOLUNTEER') {
                const regResponse = await registrationAPI.getMyRegistrations();
                setMyRegistrations(regResponse.data);
            }
        } catch (error) {
            toast.error('Không thể tải danh sách sự kiện:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterEvents = () => {
        let filtered = [...events];

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(event =>
                event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.location.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by category
        if (categoryFilter !== 'all') {
            filtered = filtered.filter(event => event.category === categoryFilter);
        }

        // Filter by Date Range (Overlap Logic)
        // Selected: [start, end]
        // Event:    [eventStart, eventEnd]
        // Overlap if: eventStart <= end && eventEnd >= start
        if (startDate || endDate) {
            filtered = filtered.filter(event => {
                const eventStart = new Date(event.startTime).getTime();
                const eventEnd = event.endTime ? new Date(event.endTime).getTime() : eventStart + (24 * 60 * 60 * 1000); // Default to 1 day duration if no end time

                const filterStart = startDate ? new Date(startDate).getTime() : Number.MIN_SAFE_INTEGER;
                // Set filterEnd to end of the selected day (23:59:59)
                const filterEnd = endDate ? new Date(endDate).getTime() + (24 * 60 * 60 * 1000) - 1 : Number.MAX_SAFE_INTEGER;

                // Check overlap
                return eventStart <= filterEnd && eventEnd >= filterStart;
            });
        }

        setFilteredEvents(filtered);
    };

    const inputSx = {
        '& .MuiOutlinedInput-root': {
            color: 'text.primary',
            bgcolor: 'background.glass',
            backdropFilter: 'blur(10px)',
            '& fieldset': { borderColor: 'divider' },
            '&:hover fieldset': { borderColor: 'text.primary' },
            '&.Mui-focused fieldset': { borderColor: 'primary.main' },
        },
        '& .MuiInputLabel-root': { color: 'text.secondary' },
        '& .MuiInputLabel-root.Mui-focused': { color: 'primary.main' },
        '& .MuiInputBase-input': { color: 'text.primary' },
        '& .MuiSvgIcon-root': { color: 'text.secondary' },
        '& .MuiSelect-icon': { color: 'text.primary' }
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            bgcolor: 'background.default',
            color: 'text.primary',
            pb: 8
        }}>
            {/* Background Accent */}
            <Box sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                height: '400px',
                background: 'radial-gradient(circle at 80% 0%, rgba(254, 107, 139, 0.1) 0%, rgba(18, 18, 18, 0) 70%)',
                zIndex: 0,
                pointerEvents: 'none'
            }} />

            <Container sx={{ position: 'relative', zIndex: 1, py: 4 }}>
                <Box sx={{ mb: 6, mt: 4, textAlign: 'center' }}>
                    <Typography
                        variant="h3"
                        gutterBottom
                        sx={{
                            fontWeight: 800,
                            background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        Khám phá Sự kiện
                    </Typography>
                    <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 300 }}>
                        Tìm kiếm và tham gia các hoạt động tình nguyện ý nghĩa
                    </Typography>
                </Box>

                {/* Filters - Luxurious Redesign */}
                <Paper
                    elevation={0}
                    sx={{
                        mb: 6,
                        p: 1.5,
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        alignItems: { xs: 'stretch', md: 'center' },
                        gap: 2,
                        borderRadius: 4, // 32px roughly
                        ...glassSx,
                        border: '1px solid',
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                        width: '100%',
                        maxWidth: '1000px', // Limit width for elegance
                        mx: 'auto' // Center it
                    }}
                >
                    {/* Search Section */}
                    <Box sx={{ flex: 2, display: 'flex', alignItems: 'center', px: 2 }}>
                        <Search sx={{ color: 'primary.main', mr: 2, fontSize: 28 }} />
                        <Box sx={{ width: '100%' }}>
                            <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                                Tìm kiếm
                            </Typography>
                            <TextField
                                fullWidth
                                placeholder="Tên sự kiện, địa điểm..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                variant="standard"
                                InputProps={{ disableUnderline: true }}
                                sx={{
                                    '& input': { fontSize: '1.1rem', fontWeight: 500 } // Bigger text
                                }}
                            />
                        </Box>
                    </Box>

                    {/* Divider for Desktop */}
                    <Box sx={{ width: '1px', height: 40, bgcolor: 'divider', display: { xs: 'none', md: 'block' } }} />

                    {/* Category Section */}
                    <Box sx={{ flex: 1, px: 2 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                            Danh mục
                        </Typography>
                        <FormControl fullWidth variant="standard">
                            <Select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                disableUnderline
                                displayEmpty
                                sx={{ fontSize: '1rem', fontWeight: 500 }}
                            >
                                <MenuItem value="all">Tất cả danh mục</MenuItem>
                                {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                                    <MenuItem key={key} value={key}>{label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>

                    <Box sx={{ width: '1px', height: 40, bgcolor: 'divider', display: { xs: 'none', md: 'block' } }} />

                    {/* Date Section */}
                    <Box sx={{ flex: 1.5, px: 2, display: 'flex', gap: 2 }}>
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                                Từ ngày
                            </Typography>
                            <TextField
                                type="date"
                                fullWidth
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                variant="standard"
                                InputProps={{ disableUnderline: true }}
                            />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                                Đến ngày
                            </Typography>
                            <TextField
                                type="date"
                                fullWidth
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                variant="standard"
                                InputProps={{ disableUnderline: true }}
                            />
                        </Box>
                    </Box>
                </Paper>

                {/* Events Grid */}
                {filteredEvents.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                        <Typography variant="h6" sx={{ color: 'text.disabled' }}>
                            Không tìm thấy sự kiện nào trong khoảng thời gian này
                        </Typography>
                    </Box>
                ) : (
                    <Grid container spacing={4}>
                        {filteredEvents.map((event) => (
                            <Grid key={event.id} size={{ xs: 12, sm: 6, md: 4 }}>
                                <EventCard
                                    event={event}
                                    registration={myRegistrations.find(r => r.eventId === event.id)}
                                />
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>
        </Box>
    );
};

export default EventBrowse;