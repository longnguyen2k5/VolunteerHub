import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  TextField,
  MenuItem,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { eventAPI } from '../../api/eventApi';
import { toast } from 'react-toastify';

const EventList = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const response = await eventAPI.getMyEvents();
      setEvents(response.data || []);
    } catch (error) {
      toast.error('Không thể tải danh sách sự kiện');
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!eventToDelete) return;

    try {
      await eventAPI.delete(eventToDelete.id);
      toast.success('Xóa sự kiện thành công');
      setDeleteDialogOpen(false);
      setEventToDelete(null);
      loadEvents();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể xóa sự kiện');
      console.error('Error deleting event:', error);
    }
  };

  const openDeleteDialog = (event) => {
    setEventToDelete(event);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setEventToDelete(null);
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      PENDING_APPROVAL: { label: 'Chờ duyệt', color: 'warning' },
      APPROVED: { label: 'Đã duyệt', color: 'success' },
      REJECTED: { label: 'Từ chối', color: 'error' },
    };

    const config = statusConfig[status] || { label: status, color: 'default' };
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return '';
    return format(new Date(dateTime), 'dd/MM/yyyy HH:mm');
  };

  const filteredEvents = events.filter((event) => {
    if (statusFilter === 'ALL') return true;
    return event.status === statusFilter;
  });

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Quản lý sự kiện
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/events/create')}
        >
          Tạo sự kiện mới
        </Button>
      </Box>

      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <TextField
          select
          label="Trạng thái"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{ minWidth: 200 }}
          size="small"
        >
          <MenuItem value="ALL">Tất cả</MenuItem>
          <MenuItem value="PENDING_APPROVAL">Chờ duyệt</MenuItem>
          <MenuItem value="APPROVED">Đã duyệt</MenuItem>
          <MenuItem value="REJECTED">Từ chối</MenuItem>
        </TextField>
      </Stack>

      {filteredEvents.length === 0 ? (
        <Alert severity="info">
          {statusFilter === 'ALL'
            ? 'Bạn chưa tạo sự kiện nào. Nhấn "Tạo sự kiện mới" để bắt đầu.'
            : 'Không có sự kiện nào với trạng thái này.'}
        </Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tên sự kiện</TableCell>
                <TableCell>Địa điểm</TableCell>
                <TableCell>Thời gian bắt đầu</TableCell>
                <TableCell>Thời gian kết thúc</TableCell>
                <TableCell>Số người tham gia</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell align="center">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEvents.map((event) => (
                <TableRow key={event.id} hover>
                  <TableCell>
                    <Typography variant="body1" fontWeight="medium">
                      {event.name}
                    </Typography>
                  </TableCell>
                  <TableCell>{event.location}</TableCell>
                  <TableCell>{formatDateTime(event.startTime)}</TableCell>
                  <TableCell>{formatDateTime(event.endTime)}</TableCell>
                  <TableCell>{event.currentParticipants || 0}</TableCell>
                  <TableCell>{getStatusChip(event.status)}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      color="info"
                      onClick={() => navigate(`/events/${event.id}`)}
                      title="Xem chi tiết"
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => navigate(`/events/edit/${event.id}`)}
                      title="Chỉnh sửa"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => openDeleteDialog(event)}
                      title="Xóa"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa sự kiện <strong>{eventToDelete?.name}</strong>? Hành động này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog}>Hủy</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EventList;
