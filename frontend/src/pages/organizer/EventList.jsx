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
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Alert,
  Tooltip,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  People as PeopleIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";
import { format } from "date-fns";
import { eventAPI } from "../../api/eventApi";
import { toast } from "react-toastify";
import { useThemeContext } from "../../context/ThemeContext";

/**
 * Trang danh sách sự kiện của người tổ chức (Event Manager).
 * Hiển thị các sự kiện đã tạo, trạng thái duyệt, và các hành động (Sửa, Xóa, Xem đăng ký).
 */
const EventList = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  // Dialog State
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

  // Action Handlers
  const handleViewDetail = (event) => {
    navigate(`/events/${event.id}`);
  };

  const handleEdit = (event) => {
    navigate(`/events/edit/${event.id}`);
  };

  const handleManageRegistrations = (event) => {
    navigate(`/events/manage/${event.id}/registrations`);
  };

  const handleDeleteClick = (event) => {
    setEventToDelete(event);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
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
    return <Chip label={config.label} color={config.color} size="small" variant="filled" />;
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return "";
    return format(new Date(dateTime), "dd/MM/yyyy HH:mm");
  };

  const filteredEvents = events.filter((event) => {
    const matchesStatus = statusFilter === "ALL" || event.status === statusFilter;
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
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
          label="Tìm kiếm theo tên"
          placeholder="Nhập tên sự kiện..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            flexGrow: 1, // Expand to fill available space
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
          }}
          size="small"
        />
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
          sx={{ borderRadius: 3 }}
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
            overflowX: 'auto', // Enable horizontal scroll
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'rgba(0,0,0,0.2)' }}>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px', py: 2 }}>Tên sự kiện</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px' }}>Địa điểm</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px' }}>Thời gian</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px' }}>Người tham gia</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px' }}>Trạng thái</TableCell>
                <TableCell align="right" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px' }}>Thao tác</TableCell>
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
                    borderColor: 'divider',
                    '&:last-child td, &:last-child th': { border: 0 }
                  }}
                >
                  <TableCell>
                    <Typography variant="body1" fontWeight={600} sx={{ color: 'primary.main' }}>
                      {event.name}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ color: 'text.primary' }}>{event.location}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="body2" sx={{ color: 'text.primary' }}>
                        {formatDateTime(event.startTime)}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        đến {formatDateTime(event.endTime)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: 'text.primary', fontWeight: 600, pl: 4 }}>{event.currentParticipants || 0}</TableCell>
                  <TableCell>{getStatusChip(event.status)}</TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Tooltip title="Xem chi tiết">
                        <IconButton
                          onClick={() => handleViewDetail(event)}
                          size="small"
                          sx={{ color: 'info.main', '&:hover': { bgcolor: 'info.main', color: 'white' } }}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Chỉnh sửa">
                        <IconButton
                          onClick={() => handleEdit(event)}
                          size="small"
                          sx={{ color: 'primary.main', '&:hover': { bgcolor: 'primary.main', color: 'white' } }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Danh sách đăng ký">
                        <IconButton
                          onClick={() => handleManageRegistrations(event)}
                          size="small"
                          sx={{ color: 'warning.main', '&:hover': { bgcolor: 'warning.main', color: 'white' } }}
                        >
                          <PeopleIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Xóa sự kiện">
                        <IconButton
                          onClick={() => handleDeleteClick(event)}
                          size="small"
                          sx={{ color: 'error.main', '&:hover': { bgcolor: 'error.main', color: 'white' } }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
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
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EventList;
