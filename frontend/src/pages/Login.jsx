import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
    Container,
    Box,
    TextField,
    Button,
    Typography,
    Card,
    CardContent,
    CircularProgress,
} from '@mui/material';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const result = await login(formData.email, formData.password);

        if (result.success) {
            navigate('/dashboard');
        }

        setLoading(false);
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
                            Chào mừng bạn trở lại VolunteerHub
                        </Typography>

                        <form onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                margin="normal"
                                required
                                autoComplete="email"
                            />
                            <TextField
                                fullWidth
                                label="Mật khẩu"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                margin="normal"
                                required
                                autoComplete="current-password"
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
                                disabled={loading}
                                sx={{ mt: 3, mb: 2 }}
                            >
                                {loading ? <CircularProgress size={24} /> : 'Đăng nhập'}
                            </Button>
                        </form>

                        <Box sx={{ textAlign: 'center', mt: 2 }}>
                            <Typography variant="body2">
                                Chưa có tài khoản?{' '}
                                <Link to="/register" style={{ textDecoration: 'none', color: '#2196f3' }}>
                                    Đăng ký ngay
                                </Link>
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
};

export default Login;