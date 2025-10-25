import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
    Container,
    Box,
    Button,
    Typography,
    Card,
    CardContent,
} from '@mui/material';
import { Login as LoginIcon } from '@mui/icons-material';

const Login = () => {
    const { login, user } = useAuth();
    const navigate = useNavigate();

    // Redirect if already logged in
    React.useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    const handleLogin = () => {
        // Start OAuth2 PKCE flow
        login();
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 8, mb: 4 }}>
                <Card>
                    <CardContent sx={{ p: 4 }}>
                        <Typography variant="h4" align="center" gutterBottom>
                            Đăng nhập
                        </Typography>
                        <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>
                            Sử dụng OAuth 2.0 với PKCE để đăng nhập an toàn
                        </Typography>

                        <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            startIcon={<LoginIcon />}
                            onClick={handleLogin}
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Đăng nhập với OAuth2
                        </Button>

                        <Box sx={{ textAlign: 'center', mt: 2 }}>
                            <Typography variant="body2">
                                Chưa có tài khoản?{' '}
                                <Link to="/register" style={{ textDecoration: 'none', color: '#2196f3' }}>
                                    Đăng ký ngay
                                </Link>
                            </Typography>
                        </Box>

                        <Box sx={{ mt: 3, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                                💡 Lưu ý: Sau khi nhấn "Đăng nhập", bạn sẽ được chuyển đến trang đăng nhập
                                của Authorization Server. Nhập email và mật khẩu đã đăng ký để tiếp tục.
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
};

export default Login;