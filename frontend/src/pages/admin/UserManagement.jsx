import { useState, useEffect } from "react";
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
  CircularProgress,
  Alert,
  Tooltip,
} from "@mui/material";
import { Lock as LockIcon, LockOpen as UnlockIcon, Download } from "@mui/icons-material";
import { format } from "date-fns";
import { getAllUsers, lockUser, unlockUser, exportUsers } from "../../api/adminApi";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";

const UserManagement = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const handleExport = async () => {
    try {
      const response = await exportUsers();
      const blob = response.data;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'users.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Xuất dữ liệu thành công');
    } catch (error) {
      toast.error('Không thể xuất dữ liệu');
      console.error(error);
    }
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      setLoading(true);
      const response = await getAllUsers();
      setUsers(response.data || []);
    } catch (error) {
      toast.error("Không thể tải danh sách người dùng");
      console.error("Error loading users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleLock = async (userId, isLocked) => {
    // Prevent admin from locking themselves
    if (userId === currentUser?.id) {
      toast.error("Bạn không thể khóa tài khoản của chính mình");
      return;
    }

    try {
      if (isLocked) {
        await unlockUser(userId);
        toast.success("Đã mở khóa tài khoản");
      } else {
        await lockUser(userId);
        toast.success("Đã khóa tài khoản");
      }
      loadUsers();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Không thể thực hiện hành động"
      );
      console.error("Error toggling lock:", error);
    }
  };

  const getRoleChip = (role) => {
    const roleConfig = {
      VOLUNTEER: { label: "Tình nguyện viên", color: "info" },
      EVENT_MANAGER: { label: "Quản lý sự kiện", color: "secondary" },
      ADMIN: { label: "Quản trị viên", color: "error" },
    };

    const config = roleConfig[role] || { label: role, color: "default" };
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return "";
    return format(new Date(dateTime), "dd/MM/yyyy HH:mm");
  };

  const filteredUsers = users.filter((user) => {
    // Role filter
    if (roleFilter !== "ALL" && user.role !== roleFilter) {
      return false;
    }

    // Search filter (name or email)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        user.fullName?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query)
      );
    }

    return true;
  });

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
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight={700} sx={{
          background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 1
        }}>
          Quản lý người dùng
        </Typography>
        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
          Quản lý tài khoản và quyền truy cập của người dùng
        </Typography>
      </Box>

      <Paper sx={{
        p: 3,
        mb: 4,
        bgcolor: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px'
      }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField
            select
            label="Vai trò"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            sx={{
              minWidth: 200,
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.4)' },
              },
              '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
              '& .MuiSelect-icon': { color: 'white' }
            }}
            size="small"
          >
            <MenuItem value="ALL">Tất cả</MenuItem>
            <MenuItem value="VOLUNTEER">Tình nguyện viên</MenuItem>
            <MenuItem value="EVENT_MANAGER">Quản lý sự kiện</MenuItem>
            <MenuItem value="ADMIN">Quản trị viên</MenuItem>
          </TextField>

          <TextField
            label="Tìm kiếm"
            placeholder="Tên hoặc email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            sx={{
              flexGrow: 1,
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.4)' },
              },
              '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }
            }}
          />

          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={handleExport}
            sx={{
              borderColor: 'rgba(255,255,255,0.3)',
              color: 'white',
              height: 40,
              '&:hover': { borderColor: '#FF8E53', color: '#FF8E53' }
            }}
          >
            Export CSV
          </Button>
        </Stack>
      </Paper>

      {filteredUsers.length === 0 ? (
        <Alert severity="info" sx={{ bgcolor: 'rgba(2, 136, 209, 0.15)', color: '#29b6f6', border: '1px solid rgba(41, 182, 246, 0.3)' }}>
          {searchQuery || roleFilter !== "ALL"
            ? "Không tìm thấy người dùng phù hợp."
            : "Chưa có người dùng nào trong hệ thống."}
        </Alert>
      ) : (
        <TableContainer component={Paper} sx={{
          bgcolor: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'
        }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'rgba(255,255,255,0.05)' }}>
                {['ID', 'Họ và tên', 'Email', 'Vai trò', 'Trạng thái', 'Ngày tạo', 'Thao tác'].map((head) => (
                  <TableCell key={head} sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    {head}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} hover sx={{
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.05) !important' },
                  '& td': { borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'white' }
                }}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>
                    <Typography variant="body1" fontWeight={500}>
                      {user.fullName}
                    </Typography>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getRoleChip(user.role)}</TableCell>
                  <TableCell>
                    {user.isLocked ? (
                      <Chip label="Đã khóa" color="error" size="small" />
                    ) : (
                      <Chip label="Hoạt động" color="success" size="small" />
                    )}
                  </TableCell>
                  <TableCell>{formatDateTime(user.createdAt)}</TableCell>
                  <TableCell align="center">
                    <Tooltip
                      title={
                        user.id === currentUser?.id
                          ? "Không thể khóa tài khoản của chính mình"
                          : user.isLocked
                            ? "Mở khóa tài khoản"
                            : "Khóa tài khoản"
                      }
                    >
                      <span>
                        <IconButton
                          size="small"
                          color={user.isLocked ? "success" : "error"}
                          onClick={() =>
                            handleToggleLock(user.id, user.isLocked)
                          }
                          disabled={user.id === currentUser?.id}
                          sx={{
                            bgcolor: 'rgba(255,255,255,0.05)',
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                            '&:disabled': { opacity: 0.3 }
                          }}
                        >
                          {user.isLocked ? <UnlockIcon /> : <LockIcon />}
                        </IconButton>
                      </span>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default UserManagement;
