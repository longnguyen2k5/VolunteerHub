import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import EventForm from '../../components/event/EventForm';
import { eventAPI } from '../../api/eventApi';
import { toast } from 'react-toastify';

const EditEvent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadEvent();
  }, [id]);

  const loadEvent = async () => {
    try {
      setLoading(true);
      const response = await eventAPI.getPublicById(id);
      setEvent(response.data);
    } catch (error) {
      setError('Không thể tải thông tin sự kiện');
      console.error('Error loading event:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (eventData) => {
    try {
      setSubmitting(true);
      await eventAPI.update(id, eventData);
      toast.success('Cập nhật sự kiện thành công!');
      navigate('/events/manage');
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error('Bạn không có quyền chỉnh sửa sự kiện này');
      } else {
        toast.error(error.response?.data?.message || 'Không thể cập nhật sự kiện');
      }
      console.error('Error updating event:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/events/manage')}>
          Quay lại danh sách
        </Button>
      </Container>
    );
  }

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
          Chỉnh sửa sự kiện
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Cập nhật thông tin sự kiện của bạn
        </Typography>
      </Box>

      {event && (
        <EventForm
          initialData={event}
          onSubmit={handleSubmit}
          submitLabel="Cập nhật"
          loading={submitting}
        />
      )}
    </Container>
  );
};

export default EditEvent;
