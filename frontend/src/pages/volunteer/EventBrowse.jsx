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
import { toast } from 'react-toastify';

const EventBrowse = () => {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');

    useEffect(() => {
        fetchEvents();
    }, []);

    useEffect(() => {
        filterEvents();
    }, [searchTerm, categoryFilter, events]);

    const fetchEvents = async () => {
        try {
            const response = await eventAPI.getAllApproved();
            setEvents(response.data);
            setFilteredEvents(response.data);
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
                event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.location.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by category
        if (categoryFilter !== 'all') {
            filtered = filtered.filter(event => event.category === categoryFilter);
        }

        setFilteredEvents(filtered);
    };

    const categories = [...new Set(events.map(e => e.category).filter(Boolean))];

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom>
                Danh sách sự kiện
            </Typography>

            {/* Filters */}
            <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <TextField
                    placeholder="Tìm kiếm sự kiện..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ flexGrow: 1, minWidth: 250 }}
                    InputProps={{
                        startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                />
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Danh mục</InputLabel>
                    <Select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        label="Danh mục"
                    >
                        <MenuItem value="all">Tất cả</MenuItem>
                        {categories.map(cat => (
                            <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {/* Events Grid */}
            {filteredEvents.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="h6" color="text.secondary">
                        Không tìm thấy sự kiện nào
                    </Typography>
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {filteredEvents.map((event) => (
                        <Grid item xs={12} sm={6} md={4} key={event.id}>
                            <EventCard event={event} />
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};

export default EventBrowse;