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
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
} from "@mui/material";
import { AccountCircle, Brightness4, Brightness7, Menu as MenuIcon } from "@mui/icons-material";
import { useThemeContext } from "../../context/ThemeContext";

// Helper component for consistent nav button styling
const NavButton = ({ to, children }) => (
  <Button
    component={Link}
    to={to}
    sx={{
      color: "text.primary",
      textTransform: "none",
      fontSize: "0.95rem",
      fontWeight: 500,
      px: 1.5,
      transition: "color 0.2s",
      "&:hover": {
        color: "primary.main",
        bgcolor: "action.hover",
      },
    }}
  >
    {children}
  </Button>
);

const Header = () => {
  const { user, logout, login } = useAuth();
  const { mode, toggleTheme } = useThemeContext();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

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

  // Drawer Content
  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2, fontWeight: 700, color: 'primary.main' }}>
        VolunteerHub
      </Typography>
      <Divider />
      <List>
        {user ? (
          <>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/events">
                <ListItemText primary="Sự kiện" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/dashboard">
                <ListItemText primary="Dashboard" />
              </ListItemButton>
            </ListItem>

            {user.role === "EVENT_MANAGER" && (
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/events/manage">
                  <ListItemText primary="Quản lý sự kiện" />
                </ListItemButton>
              </ListItem>
            )}

            {user.role === "VOLUNTEER" && (
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/my-registrations">
                  <ListItemText primary="Lịch sử tham gia" />
                </ListItemButton>
              </ListItem>
            )}

            {user.role === "ADMIN" && (
              <>
                <ListItem disablePadding>
                  <ListItemButton component={Link} to="/admin/events">
                    <ListItemText primary="Duyệt sự kiện" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton component={Link} to="/admin/users">
                    <ListItemText primary="Quản lý users" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton component={Link} to="/admin/users/create">
                    <ListItemText primary="Tạo Admin" />
                  </ListItemButton>
                </ListItem>
              </>
            )}
          </>
        ) : (
          <>
            <ListItem disablePadding>
              <ListItemButton onClick={() => { login(); handleDrawerToggle(); }}>
                <ListItemText primary="Đăng nhập" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/register">
                <ListItemText primary="Đăng ký" />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    // --- THAY ĐỔI CHÍNH LÀ Ở ĐÂY ---
    // Bỏ 'color="transparent"'
    // Thêm sx={{ bgcolor: 'rgba(0, 0, 0, 0.4)' }}
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        bgcolor: "background.glass", // Semantic, managed by theme
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid",
        borderColor: "background.glassBorder",
        transition: "all 0.3s ease-in-out",
        color: "text.primary"
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", py: 0.5 }}>

        {/* Mobile Menu Button */}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { md: "none" } }}
        >
          <MenuIcon />
        </IconButton>

        {/* Logo Area */}
        <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', gap: 1.5 }}>
          <Box
            component="img"
            src="/logo.png"
            alt="Logo"
            sx={{ width: 40, height: 40, objectFit: 'contain', borderRadius: '50%' }}
          />
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              letterSpacing: "0.5px",
              background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            VolunteerHub
          </Typography>
        </Box>

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
                  border: "1px solid",
                  borderColor: "divider",
                  "&:hover": { bgcolor: "action.hover" },
                }}
              >
                <AccountCircle sx={{ fontSize: 32, color: "text.primary" }} />
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
                    bgcolor: "background.paper",
                    color: "text.primary",
                    "& .MuiMenuItem-root": {
                      fontSize: "0.9rem",
                      "&:hover": {
                        bgcolor: "action.hover", // Semantic hover
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
                      bgcolor: "background.paper", // Semantic bg
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                      align: "right"
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <Box sx={{ px: 2, py: 1, borderBottom: "1px solid", borderColor: "divider" }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {user.fullName}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
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
              {/* Desktop Auth Buttons */}
              <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1.5 }}>
                <Button
                  color="inherit"
                  onClick={() => login && login()}
                  sx={{
                    color: "text.primary",
                    textTransform: "none",
                    fontWeight: 500,
                    "&:hover": { color: "primary.main" },
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
                    px: 3,
                    "&:hover": {
                      bgcolor: "rgba(255, 255, 255, 0.9)",
                    },
                  }}
                >
                  Đăng ký
                </Button>
              </Box>
            </Box>
          )}

          {/* Theme Toggle Button */}
          <IconButton onClick={toggleTheme} sx={{ color: 'text.primary', ml: 1 }}>
            {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Box>
      </Toolbar>

      {/* Mobile Drawer */}
      <Box component="nav">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </AppBar>
  );
};

export default Header;
