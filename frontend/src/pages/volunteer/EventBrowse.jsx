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

                {/* Filters */}
                <Box sx={{
                    mb: 5,
                    display: 'flex',
                    gap: 2,
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    bgcolor: 'background.paper',
                    p: 3,
                    borderRadius: '24px',
                    border: '1px solid',
                    borderColor: 'divider',
                    ...glassSx,
                }}>
                    <TextField
                        placeholder="Tìm kiếm sự kiện..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{ flexGrow: 1, minWidth: 200, ...inputSx }}
                        InputProps={{
                            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                        }}
                    />

                    <FormControl sx={{ minWidth: 150, ...inputSx }}>
                        <InputLabel>Danh mục</InputLabel>
                        <Select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            label="Danh mục"
                            MenuProps={{
                                PaperProps: {
                                    sx: {
                                        bgcolor: 'background.paper',
                                        color: 'text.primary',
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        '& .MuiMenuItem-root:hover': { bgcolor: 'action.hover' },
                                        '& .MuiMenuItem-root.Mui-selected': { bgcolor: 'primary.light', color: 'primary.contrastText' }
                                    }
                                }
                            }}
                        >
                            <MenuItem value="all">Tất cả</MenuItem>
                            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                                <MenuItem key={key} value={key}>{label}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        label="Từ ngày"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        sx={{ minWidth: 150, ...inputSx }}
                    />

                    <Typography variant="body1" sx={{ color: 'text.secondary' }}>-</Typography>

                    <TextField
                        label="Đến ngày"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        sx={{ minWidth: 150, ...inputSx }}
                    />
                </Box>

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