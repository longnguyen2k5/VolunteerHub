import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { AccountCircle } from "@mui/icons-material";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    handleClose();
  };

  return (
    // --- THAY ĐỔI CHÍNH LÀ Ở ĐÂY ---
    // Bỏ 'color="transparent"'
    // Thêm sx={{ bgcolor: 'rgba(0, 0, 0, 0.4)' }}
    <AppBar
      position="fixed"
      elevation={0} // Giữ nguyên để bỏ bóng mờ
      sx={{
        bgcolor: "rgba(0, 0, 0, 0.4)", // Nền đen mờ 40%
        // Bạn có thể chỉnh 0.4 thành 0.3 (nhạt hơn) hoặc 0.5 (đậm hơn)
      }}
    >
      {/* Giữ nguyên sx={{ color: 'white' }} để chữ luôn là màu trắng */}
      <Toolbar sx={{ color: "white" }}>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ flexGrow: 1, textDecoration: "none", color: "inherit" }}
        >
          VolunteerHub
        </Typography>

        {user ? (
          <Box>
            {/* Common menu items for all authenticated users */}
            <Button color="inherit" component={Link} to="/events">
              Sự kiện
            </Button>
            <Button color="inherit" component={Link} to="/dashboard">
              Dashboard
            </Button>

            {/* EVENT_MANAGER only */}
            {(user.role === "EVENT_MANAGER" || user.role === "ADMIN") && (
              <Button color="inherit" component={Link} to="/events/manage">
                Quản lý sự kiện
              </Button>
            )}

            {/* ADMIN only */}
            {user.role === "ADMIN" && (
              <>
                <Button color="inherit" component={Link} to="/admin/events">
                  Duyệt sự kiện
                </Button>
                <Button color="inherit" component={Link} to="/admin/users">
                  Quản lý users
                </Button>
              </>
            )}

            <IconButton size="large" onClick={handleMenu} color="inherit">
              <AccountCircle />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>
                {user.fullName} ({user.role})
              </MenuItem>
              <MenuItem
                onClick={() => {
                  navigate("/profile");
                  handleClose();
                }}
              >
                Hồ sơ
              </MenuItem>
              <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
            </Menu>
          </Box>
        ) : (
          <Box>
            <Button color="inherit" component={Link} to="/login">
              Đăng nhập
            </Button>
            <Button color="inherit" component={Link} to="/register">
              Đăng ký
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
