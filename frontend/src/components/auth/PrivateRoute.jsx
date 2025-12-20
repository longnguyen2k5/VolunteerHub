import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { CircularProgress, Box } from '@mui/material';

// Component phụ trợ để kích hoạt side-effect đăng nhập
const RedirectToAuth = () => {
    const { login } = useAuth();

    React.useEffect(() => {
        login();
    }, [login]);

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <CircularProgress />
        </Box>
    );
};

// Route bảo vệ yêu cầu đăng nhập và phân quyền
const PrivateRoute = ({ children, allowedRoles = [] }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    // Chưa đăng nhập -> Chuyển hướng đến trang đăng nhập (thông qua RedirectToAuth)
    if (!user) {
        return <RedirectToAuth />;
    }

    // Đã đăng nhập nhưng không có quyền -> Chuyển về Dashboard
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default PrivateRoute;