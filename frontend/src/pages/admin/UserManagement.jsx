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
  Chip,
  IconButton,
  TextField,
  MenuItem,
  Stack,
  CircularProgress,
  Alert,
  Tooltip,
} from "@mui/material";
import { Lock as LockIcon, LockOpen as UnlockIcon } from "@mui/icons-material";
import { format } from "date-fns";
import { getAllUsers, lockUser, unlockUser } from "../../api/adminApi";
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

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data || []);
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
      EVENT_MANAGER: { label: "Quản lý sự kiện", color: "primary" },
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
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1">
          Quản lý người dùng
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Quản lý tài khoản và quyền truy cập của người dùng
        </Typography>
      </Box>

      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <TextField
          select
          label="Vai trò"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          sx={{ minWidth: 200 }}
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
          sx={{ flexGrow: 1 }}
        />
      </Stack>

      {filteredUsers.length === 0 ? (
        <Alert severity="info">
          {searchQuery || roleFilter !== "ALL"
            ? "Không tìm thấy người dùng phù hợp."
            : "Chưa có người dùng nào trong hệ thống."}
        </Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Họ và tên</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Vai trò</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Ngày tạo</TableCell>
                <TableCell align="center">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>
                    <Typography variant="body1" fontWeight="medium">
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
