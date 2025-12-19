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
  Tabs,
  Tab,
} from "@mui/material";
import {
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Download as DownloadIcon,
  Restore as RestoreIcon,
} from "@mui/icons-material";
import { format } from "date-fns";
import { eventAPI } from "../../api/eventApi";
import { toast } from "react-toastify";

const EventApproval = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState("PENDING_APPROVAL");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [actionType, setActionType] = useState(null); // 'approve', 'reject', or 'revert'

  useEffect(() => {
    loadEvents();
  }, [currentTab]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      // Backend endpoint /events/pending now accepts ?status=... 
      const response = await eventAPI.getPendingEvents({ status: currentTab });
      setEvents(response.data || []);
    } catch (error) {
      toast.error("Không thể tải danh sách sự kiện");
      console.error("Error loading events:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
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
      } else if (actionType === "revert") {
        await eventAPI.revertEvent(selectedEvent.id);
        toast.success(`Đã hoàn tác sự kiện "${selectedEvent.name}" về Chờ duyệt`);
      }
      closeDialog();
      loadEvents(); // Reload current tab to reflect changes
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Không thể thực hiện hành động"
      );
      console.error("Error performing action:", error);
    }
  };

  const handleExport = async () => {
    try {
      const blob = await eventAPI.exportEvents(currentTab);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `events_${currentTab.toLowerCase()}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Xuất dữ liệu thành công');
    } catch (error) {
      toast.error('Không thể xuất dữ liệu');
    }
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return "";
    return format(new Date(dateTime), "dd/MM/yyyy HH:mm");
  };

  const getStatusChip = (status) => {
    const config = {
      PENDING_APPROVAL: { label: "Chờ duyệt", color: "warning" },
      APPROVED: { label: "Đã duyệt", color: "success" },
      REJECTED: { label: "Từ chối", color: "error" },
    };
    const item = config[status] || { label: status, color: "default" };
    return <Chip label={item.label} color={item.color} size="small" />;
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" component="h1">
            Quản lý sự kiện
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Duyệt và kiểm soát trạng thái các sự kiện
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={handleExport}
        >
          Export CSV
        </Button>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Chờ phê duyệt" value="PENDING_APPROVAL" />
          <Tab label="Đã duyệt" value="APPROVED" />
          <Tab label="Đã từ chối" value="REJECTED" />
        </Tabs>
      </Paper>

      {loading ? (
        <Container sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Container>
      ) : events.length === 0 ? (
        <Alert severity="info">
          {currentTab === 'PENDING_APPROVAL'
            ? "Không có sự kiện nào đang chờ duyệt."
            : "Không có sự kiện nào trong danh sách này."}
        </Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tên sự kiện</TableCell>
                <TableCell>Người tạo</TableCell>
                <TableCell>Địa điểm</TableCell>
                <TableCell>Thời gian bắt đầu</TableCell>
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
                  <TableCell>
                    {getStatusChip(event.status)}
                  </TableCell>
                  <TableCell align="center">
                    {/* Approved Tab: Show Revert Button */}
                    {event.status === 'APPROVED' && (
                      <Button
                        size="small"
                        variant="outlined"
                        color="warning"
                        startIcon={<RestoreIcon />}
                        onClick={() => openDialog(event, "revert")}
                      >
                        Hoàn tác
                      </Button>
                    )}

                    {/* Pending Tab: Show Approve/Reject Buttons */}
                    {event.status === 'PENDING_APPROVAL' ? (
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
                    ) : (
                      // If not Approved and not Pending (i.e. REJECTED), check if we want Revert there too?
                      // User manual said "duyệt một sự kiện thì có thể sang lại tab sự kiện đã được duyệt"
                      // So minimal scope is Approved tab. For Rejected, logic is same if we want.
                      // Let's keep it simple for now or add Revert to Rejected too?
                      // "đưa lại sự kiện đó quay lại hàng đợi duyệt/từ chối"
                      event.status === 'REJECTED' && (
                        <Button
                          size="small"
                          variant="outlined"
                          color="warning"
                          startIcon={<RestoreIcon />}
                          onClick={() => openDialog(event, "revert")}
                        >
                          Hoàn tác
                        </Button>
                      )
                    )}
                    {/* Fallback for formatting consistency if needed, but the conditions cover all states */}
                    {!['APPROVED', 'PENDING_APPROVAL', 'REJECTED'].includes(event.status) && (
                      <Typography variant="caption" color="text.secondary">-</Typography>
                    )}
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
            : actionType === "reject" ? "Xác nhận từ chối sự kiện" : "Xác nhận hoàn tác sự kiện"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {actionType === "approve" ? (
              <>
                Bạn có chắc chắn muốn <strong>duyệt</strong> sự kiện{" "}
                <strong>"{selectedEvent?.name}"</strong>? Sự kiện sẽ được công
                khai cho tình nguyện viên đăng ký.
              </>
            ) : actionType === "reject" ? (
              <>
                Bạn có chắc chắn muốn <strong>từ chối</strong> sự kiện{" "}
                <strong>"{selectedEvent?.name}"</strong>? Sự kiện sẽ không được
                công khai.
              </>
            ) : (
              <>
                Bạn có chắc chắn muốn <strong>hoàn tác</strong> trạng thái của sự kiện{" "}
                <strong>"{selectedEvent?.name}"</strong>? Sự kiện sẽ quay lại trạng thái <strong>Chờ phê duyệt</strong>.
              </>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Hủy</Button>
          <Button
            onClick={handleAction}
            color={actionType === "approve" ? "success" : actionType === "reject" ? "error" : "warning"}
            variant="contained"
          >
            {actionType === "approve" ? "Duyệt" : actionType === "reject" ? "Từ chối" : "Hoàn tác"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EventApproval;
