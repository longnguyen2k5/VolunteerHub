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
import { useThemeContext } from "../../context/ThemeContext";

const EventApproval = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState("PENDING_APPROVAL");
  const { glassSx } = useThemeContext();

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
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4, minHeight: '80vh' }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight={700} sx={{
            background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1
          }}>
            Quản lý sự kiện
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Duyệt và kiểm soát trạng thái các sự kiện
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={handleExport}
          sx={{
            borderColor: 'rgba(255,255,255,0.3)',
            color: 'text.primary',
            '&:hover': { borderColor: '#FF8E53', color: '#FF8E53', bgcolor: 'action.hover' }
          }}
        >
          Export CSV
        </Button>
      </Box>

      <Paper sx={{
        mb: 4,
        ...glassSx,
        borderRadius: '16px',
        overflow: 'hidden'
      }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          centered
          sx={{
            '& .MuiTab-root': { color: 'text.secondary', fontWeight: 600 },
            '& .Mui-selected': { color: 'primary.main', fontWeight: 700 }, // No important needed usually if specificity is right
            '& .MuiTabs-indicator': { bgcolor: 'primary.main' }
          }}
        >
          <Tab label="Chờ phê duyệt" value="PENDING_APPROVAL" />
          <Tab label="Đã duyệt" value="APPROVED" />
          <Tab label="Đã từ chối" value="REJECTED" />
        </Tabs>
      </Paper>

      {loading ? (
        <Container sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress sx={{ color: 'primary.main' }} />
        </Container>
      ) : events.length === 0 ? (
        <Alert severity="info">
          {currentTab === 'PENDING_APPROVAL'
            ? "Không có sự kiện nào đang chờ duyệt."
            : "Không có sự kiện nào trong danh sách này."}
        </Alert>
      ) : (
        <TableContainer component={Paper} sx={{
          ...glassSx,
          borderRadius: '16px',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'
        }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'action.hover' }}>
                {['Tên sự kiện', 'Người tạo', 'Địa điểm', 'Thời gian bắt đầu', 'Trạng thái', 'Thao tác'].map((head) => (
                  <TableCell key={head} sx={{ color: 'text.secondary', fontWeight: 700, borderBottom: '1px solid', borderColor: 'divider' }}>
                    {head}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event.id} hover sx={{
                  '&:hover': { bgcolor: 'action.hover' },
                  '& td': { borderBottom: '1px solid', borderColor: 'divider', color: 'text.primary' }
                }}>
                  <TableCell>
                    <Typography variant="body1" fontWeight="bold">
                      {event.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
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
                          sx={{ background: 'linear-gradient(45deg, #43a047 30%, #66bb6a 90%)', color: 'white' }}
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
      <Dialog
        open={dialogOpen}
        onClose={closeDialog}
        PaperProps={{
          sx: {
            bgcolor: 'background.paper',
            color: 'text.primary',
            border: '1px solid',
            borderColor: 'divider',
            minWidth: 400
          }
        }}
      >
        <DialogTitle sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
          {actionType === "approve"
            ? "Xác nhận duyệt sự kiện"
            : actionType === "reject" ? "Xác nhận từ chối sự kiện" : "Xác nhận hoàn tác sự kiện"}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <DialogContentText sx={{ color: 'text.secondary' }}>
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
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={closeDialog} sx={{ color: 'text.secondary' }}>Hủy</Button>
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
