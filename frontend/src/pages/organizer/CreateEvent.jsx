import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import EventForm from '../../components/event/EventForm';
import { eventAPI } from '../../api/eventApi';
import { toast } from 'react-toastify';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (eventData) => {
    try {
      setLoading(true);
      await eventAPI.create(eventData);
      toast.success('Tạo sự kiện thành công! Sự kiện đang chờ admin duyệt.');
      navigate('/events/manage');
    } catch (error) {
      console.error('Error creating event:', error);
      console.error('Response data:', error.response?.data);
      toast.error(error.response?.data?.message || 'Không thể tạo sự kiện');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/events/manage')}
          sx={{ mb: 2 }}
        >
          Quay lại danh sách
        </Button>
        <Typography variant="h4" component="h1">
          Tạo sự kiện mới
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Sự kiện của bạn sẽ cần được admin duyệt trước khi công khai
        </Typography>
      </Box>

      <EventForm
        onSubmit={handleSubmit}
        submitLabel="Tạo sự kiện"
        loading={loading}
      />
    </Container>
  );
};

export default CreateEvent;
