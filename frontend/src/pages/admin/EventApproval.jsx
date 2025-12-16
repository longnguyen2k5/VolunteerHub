import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Chip,
  Stack,
} from "@mui/material";
import {
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
} from "@mui/icons-material";
import { format } from "date-fns";
import { eventAPI } from "../../api/eventApi";
import { toast } from "react-toastify";

const EventApproval = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [actionType, setActionType] = useState(null); // 'approve' or 'reject'

  useEffect(() => {
    loadPendingEvents();
  }, []);

  const loadPendingEvents = async () => {
    try {
      setLoading(true);
      const response = await eventAPI.getPendingEvents();
      setEvents(response.data || []);
    } catch (error) {
      toast.error("Không thể tải danh sách sự kiện chờ duyệt");
      console.error("Error loading pending events:", error);
    } finally {
      setLoading(false);
    }
  };

  const openDialog = (event, type) => {
    setSelectedEvent(event);
    setActionType(type);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setSelectedEvent(null);
    setActionType(null);
  };

  const handleAction = async () => {
    if (!selectedEvent) return;

    try {
      if (actionType === "approve") {
        await eventAPI.approveEvent(selectedEvent.id);
        toast.success(`Đã duyệt sự kiện "${selectedEvent.name}"`);
      } else if (actionType === "reject") {
        await eventAPI.rejectEvent(selectedEvent.id);
        toast.success(`Đã từ chối sự kiện "${selectedEvent.name}"`);
      }
      closeDialog();
      loadPendingEvents();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Không thể thực hiện hành động"
      );
      console.error("Error performing action:", error);
    }
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return "";
    return format(new Date(dateTime), "dd/MM/yyyy HH:mm");
  };

  if (loading) {
    return (
      <Container
        maxWidth="lg"
        sx={{ mt: 4, display: "flex", justifyContent: "center" }}
      >
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1">
          Duyệt sự kiện
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Quản lý các sự kiện đang chờ phê duyệt
        </Typography>
      </Box>

      {events.length === 0 ? (
        <Alert severity="info">Không có sự kiện nào đang chờ duyệt.</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tên sự kiện</TableCell>
                <TableCell>Người tạo</TableCell>
                <TableCell>Địa điểm</TableCell>
                <TableCell>Thời gian bắt đầu</TableCell>
                <TableCell>Thời gian kết thúc</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell align="center">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event.id} hover>
                  <TableCell>
                    <Typography variant="body1" fontWeight="medium">
                      {event.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {event.description?.substring(0, 60)}
                      {event.description?.length > 60 ? "..." : ""}
                    </Typography>
                  </TableCell>
                  <TableCell>{event.managerName || "N/A"}</TableCell>
                  <TableCell>{event.location}</TableCell>
                  <TableCell>{formatDateTime(event.startTime)}</TableCell>
                  <TableCell>{formatDateTime(event.endTime)}</TableCell>
                  <TableCell>
                    <Chip label="Chờ duyệt" color="warning" size="small" />
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        startIcon={<ApproveIcon />}
                        onClick={() => openDialog(event, "approve")}
                      >
                        Duyệt
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        startIcon={<RejectIcon />}
                        onClick={() => openDialog(event, "reject")}
                      >
                        Từ chối
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={dialogOpen} onClose={closeDialog}>
        <DialogTitle>
          {actionType === "approve"
            ? "Xác nhận duyệt sự kiện"
            : "Xác nhận từ chối sự kiện"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {actionType === "approve" ? (
              <>
                Bạn có chắc chắn muốn <strong>duyệt</strong> sự kiện{" "}
                <strong>"{selectedEvent?.name}"</strong>? Sự kiện sẽ được công
                khai cho tình nguyện viên đăng ký.
              </>
            ) : (
              <>
                Bạn có chắc chắn muốn <strong>từ chối</strong> sự kiện{" "}
                <strong>"{selectedEvent?.name}"</strong>? Sự kiện sẽ không được
                công khai.
              </>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Hủy</Button>
          <Button
            onClick={handleAction}
            color={actionType === "approve" ? "success" : "error"}
            variant="contained"
          >
            {actionType === "approve" ? "Duyệt" : "Từ chối"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EventApproval;
