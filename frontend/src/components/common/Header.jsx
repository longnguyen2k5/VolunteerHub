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

// Helper component for consistent nav button styling
const NavButton = ({ to, children }) => (
  <Button
    component={Link}
    to={to}
    sx={{
      color: "rgba(255, 255, 255, 0.8)",
      textTransform: "none",
      fontSize: "0.95rem",
      fontWeight: 500,
      px: 1.5,
      transition: "color 0.2s",
      "&:hover": {
        color: "#fff",
        background: "rgba(255,255,255,0.05)",
      },
    }}
  >
    {children}
  </Button>
);

const Header = () => {
  const { user, logout, login } = useAuth();
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
      elevation={0}
      sx={{
        bgcolor: "rgba(13, 13, 13, 0.4)", // Dark, sophisticated background
        backdropFilter: "blur(12px)", // Glassmorphism effect
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)", // Subtle border
        transition: "all 0.3s ease-in-out",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", py: 0.5 }}>
        {/* Logo Area */}
        <Typography
          variant="h5"
          component={Link}
          to="/"
          sx={{
            textDecoration: "none",
            color: "#fff",
            fontWeight: 700,
            letterSpacing: "0.5px",
            background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            "&:hover": {
              opacity: 0.9,
            },
          }}
        >
          VolunteerHub
        </Typography>

        {/* Navigation & User Actions */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {user ? (
            <>
              {/* Desktop Menu Items */}
              <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
                <NavButton to="/events">Sự kiện</NavButton>
                <NavButton to="/dashboard">Dashboard</NavButton>

                {user.role === "EVENT_MANAGER" && (
                  <NavButton to="/events/manage">Quản lý sự kiện</NavButton>
                )}

                {user.role === "VOLUNTEER" && (
                  <NavButton to="/my-registrations">Lịch sử tham gia</NavButton>
                )}

                {user.role === "ADMIN" && (
                  <>
                    <NavButton to="/admin/events">Duyệt sự kiện</NavButton>
                    <NavButton to="/admin/users">Quản lý users</NavButton>
                    <NavButton to="/admin/users/create">Tạo Admin</NavButton>
                  </>
                )}
              </Box>

              {/* User Avatar / Menu Trigger */}
              <IconButton
                onClick={handleMenu}
                sx={{
                  ml: 1,
                  p: 0.5,
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  "&:hover": { bgcolor: "rgba(255, 255, 255, 0.1)" },
                }}
              >
                <AccountCircle sx={{ fontSize: 32, color: "white" }} />
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                    mt: 1.5,
                    bgcolor: "#1e1e1e",
                    color: "white",
                    "& .MuiMenuItem-root": {
                      fontSize: "0.9rem",
                      "&:hover": {
                        bgcolor: "rgba(255, 255, 255, 0.08)",
                      },
                    },
                    "&:before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: "#1e1e1e",
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <Box sx={{ px: 2, py: 1, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {user.fullName}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "gray" }}>
                    {user.role}
                  </Typography>
                </Box>
                <MenuItem
                  onClick={() => {
                    navigate("/profile");
                    handleClose();
                  }}
                  sx={{ mt: 1 }}
                >
                  Hồ sơ cá nhân
                </MenuItem>
                <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
              </Menu>
            </>
          ) : (
            <Box sx={{ display: "flex", gap: 1.5 }}>
              <Button
                color="inherit"
                onClick={() => login && login()}
                sx={{
                  color: "white",
                  textTransform: "none",
                  fontWeight: 500,
                  "&:hover": { color: "#90caf9" },
                }}
              >
                Đăng nhập
              </Button>
              <Button
                component={Link}
                to="/register"
                variant="contained"
                sx={{
                  bgcolor: "white",
                  color: "black",
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: "20px",
                  px: 3,
                  "&:hover": {
                    bgcolor: "rgba(255, 255, 255, 0.9)",
                  },
                }}
              >
                Đăng ký
              </Button>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
