import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  People as PeopleIcon,
} from "@mui/icons-material";
import { format } from "date-fns";
import { eventAPI } from "../../api/eventApi";
import { toast } from "react-toastify";
import { useThemeContext } from "../../context/ThemeContext";

const EventList = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const { glassSx } = useThemeContext();

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const response = await eventAPI.getMyEvents();
      setEvents(response.data || []);
    } catch (error) {
      toast.error("Không thể tải danh sách sự kiện");
      console.error("Error loading events:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!eventToDelete) return;

    try {
      await eventAPI.delete(eventToDelete.id);
      toast.success("Xóa sự kiện thành công");
      setDeleteDialogOpen(false);
      setEventToDelete(null);
      loadEvents();
    } catch (error) {
      toast.error(error.response?.data?.message || "Không thể xóa sự kiện");
      console.error("Error deleting event:", error);
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
      PENDING_APPROVAL: { label: "Chờ duyệt", color: "warning" },
      APPROVED: { label: "Đã duyệt", color: "success" },
      REJECTED: { label: "Từ chối", color: "error" },
    };

    const config = statusConfig[status] || { label: status, color: "default" };
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return "";
    return format(new Date(dateTime), "dd/MM/yyyy HH:mm");
  };

  const filteredEvents = events.filter((event) => {
    if (statusFilter === "ALL") return true;
    return event.status === statusFilter;
  });

  if (loading) {
    return (
      <Container
        maxWidth="lg"
        sx={{ mt: 4, display: "flex", justifyContent: "center" }}
      >
        <CircularProgress sx={{ color: 'primary.main' }} />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 10, minHeight: '80vh' }}>
      <Box
        sx={{
          mb: 5,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
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
            Quản lý sự kiện
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Tổ chức và theo dõi các hoạt động của bạn
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/events/create")}
          sx={{
            borderRadius: '30px',
            background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
            boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 600,
            px: 3
          }}
        >
          Tạo sự kiện mới
        </Button>
      </Box>

      <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
        <TextField
          select
          label="Trạng thái"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{
            minWidth: 200,
            '& .MuiOutlinedInput-root': {
              color: 'text.primary',
              bgcolor: 'background.paper',
              borderRadius: '12px',
              '& fieldset': { borderColor: 'divider' },
              '&:hover fieldset': { borderColor: 'text.primary' },
              '&.Mui-focused fieldset': { borderColor: 'primary.main' },
            },
            '& .MuiInputLabel-root': { color: 'text.secondary' },
            '& .MuiInputLabel-root.Mui-focused': { color: 'primary.main' },
            '& .MuiSvgIcon-root': { color: 'text.primary' },
          }}
          size="small"
        >
          <MenuItem value="ALL">Tất cả</MenuItem>
          <MenuItem value="PENDING_APPROVAL">Chờ duyệt</MenuItem>
          <MenuItem value="APPROVED">Đã duyệt</MenuItem>
          <MenuItem value="REJECTED">Từ chối</MenuItem>
        </TextField>
      </Stack>

      {filteredEvents.length === 0 ? (
        <Alert
          severity="info"
        >
          {statusFilter === "ALL"
            ? 'Bạn chưa tạo sự kiện nào. Nhấn "Tạo sự kiện mới" để bắt đầu.'
            : "Không có sự kiện nào với trạng thái này."}
        </Alert>
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            ...glassSx,
            borderRadius: '24px',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
            overflow: 'hidden'
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'action.hover' }}>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Tên sự kiện</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Địa điểm</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Bắt đầu</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Kết thúc</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Người tham gia</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Trạng thái</TableCell>
                <TableCell align="center" sx={{ color: 'text.secondary', fontWeight: 600 }}>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEvents.map((event) => (
                <TableRow
                  key={event.id}
                  hover
                  sx={{
                    '&:hover': { bgcolor: 'action.hover' },
                    transition: 'background-color 0.2s',
                    borderBottom: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <TableCell>
                    <Typography variant="body1" fontWeight={600} sx={{ color: 'primary.main' }}>
                      {event.name}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ color: 'text.primary' }}>{event.location}</TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>{formatDateTime(event.startTime)}</TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>{formatDateTime(event.endTime)}</TableCell>
                  <TableCell sx={{ color: 'text.primary', fontWeight: 600 }}>{event.currentParticipants || 0}</TableCell>
                  <TableCell>{getStatusChip(event.status)}</TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <IconButton
                        size="small"
                        sx={{ color: 'text.secondary', '&:hover': { color: '#29b6f6', bgcolor: 'rgba(41, 182, 246, 0.1)' } }}
                        onClick={() => navigate(`/events/${event.id}`)}
                        title="Xem chi tiết"
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        sx={{ color: 'text.secondary', '&:hover': { color: '#ffa726', bgcolor: 'rgba(255, 167, 38, 0.1)' } }}
                        onClick={() => navigate(`/events/edit/${event.id}`)}
                        title="Chỉnh sửa"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        sx={{ color: 'text.secondary', '&:hover': { color: '#ab47bc', bgcolor: 'rgba(171, 71, 188, 0.1)' } }}
                        onClick={() => navigate(`/events/manage/${event.id}/registrations`)}
                        title="Quản lý đăng ký"
                      >
                        <PeopleIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        sx={{ color: 'text.secondary', '&:hover': { color: '#ef5350', bgcolor: 'rgba(239, 83, 80, 0.1)' } }}
                        onClick={() => openDeleteDialog(event)}
                        title="Xóa"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={closeDeleteDialog}
        PaperProps={{
          sx: {
            bgcolor: 'background.paper',
            color: 'text.primary',
            border: '1px solid',
            borderColor: 'divider',
            minWidth: '400px'
          }
        }}
      >
        <DialogTitle sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>Xác nhận xóa</DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <DialogContentText sx={{ color: 'text.secondary' }}>
            Bạn có chắc chắn muốn xóa sự kiện{" "}
            <strong>{eventToDelete?.name}</strong>? Hành động này không thể hoàn
            tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button onClick={closeDeleteDialog} sx={{ color: 'text.secondary' }}>Hủy</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EventList;
