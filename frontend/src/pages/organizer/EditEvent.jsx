import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import EventForm from "../../components/event/EventForm";
import { eventAPI } from "../../api/eventApi";
import { toast } from "react-toastify";

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
      setError("Không thể tải thông tin sự kiện");
      console.error("Error loading event:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (eventData) => {
    try {
      setSubmitting(true);
      await eventAPI.update(id, eventData);
      toast.success("Cập nhật sự kiện thành công!");
      navigate("/events/manage");
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error("Bạn không có quyền chỉnh sửa sự kiện này");
      } else {
        toast.error(
          error.response?.data?.message || "Không thể cập nhật sự kiện"
        );
      }
      console.error("Error updating event:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container
        maxWidth="md"
        sx={{ mt: 4, display: "flex", justifyContent: "center" }}
      >
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
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/events/manage")}
        >
          Quay lại danh sách
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 10, minHeight: '80vh' }}>
      <Box sx={{ mb: 5 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/events/manage")}
          sx={{
            mb: 3,
            color: 'rgba(255,255,255,0.7)',
            '&:hover': { color: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
          }}
        >
          Quay lại danh sách
        </Button>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 800,
            background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1
          }}
        >
          Chỉnh sửa sự kiện
        </Typography>
        <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 300 }}>
          Cập nhật thông tin chi tiết cho sự kiện của bạn
        </Typography>
      </Box>

      {event && (
        <EventForm
          initialData={event}
          onSubmit={handleSubmit}
          submitLabel="Cập nhật thay đổi"
          loading={submitting}
        />
      )}
    </Container>
  );
};

export default EditEvent;
