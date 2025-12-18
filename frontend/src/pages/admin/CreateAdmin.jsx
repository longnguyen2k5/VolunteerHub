import React, { useState } from 'react';
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Box,
    Alert,
    Stack
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import adminApi from '../../api/adminApi';
import { toast } from 'react-toastify';

const CreateAdmin = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setError('Mật khẩu nhập lại không khớp');
            return;
        }

        if (formData.password.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }

        setLoading(true);
        try {
            await adminApi.createAdmin({
                fullName: formData.fullName,
                email: formData.email,
                password: formData.password,
                role: 'ADMIN' // Backend ensures role is set, but DTO might need it
            });
            toast.success('Tạo tài khoản Admin thành công!');
            navigate('/admin/users');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Có lỗi xảy ra khi tạo tài khoản');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h5" component="h1" gutterBottom fontWeight="bold" textAlign="center">
                    Tạo Tài Khoản Admin Mới
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <form onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                        <TextField
                            label="Họ và tên"
                            name="fullName"
                            fullWidth
                            required
                            value={formData.fullName}
                            onChange={handleChange}
                        />

                        <TextField
                            label="Email"
                            name="email"
                            type="email"
                            fullWidth
                            required
                            value={formData.email}
                            onChange={handleChange}
                        />

                        <TextField
                            label="Mật khẩu"
                            name="password"
                            type="password"
                            fullWidth
                            required
                            value={formData.password}
                            onChange={handleChange}
                        />

                        <TextField
                            label="Nhập lại mật khẩu"
                            name="confirmPassword"
                            type="password"
                            fullWidth
                            required
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />

                        <Box sx={{ display: 'flex', gap: 2, pt: 2 }}>
                            <Button
                                variant="outlined"
                                color="secondary"
                                fullWidth
                                onClick={() => navigate('/admin/users')}
                                disabled={loading}
                            >
                                Hủy
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                disabled={loading}
                            >
                                {loading ? 'Đang tạo...' : 'Tạo Tài Khoản'}
                            </Button>
                        </Box>
                    </Stack>
                </form>
            </Paper>
        </Container>
    );
};

export default CreateAdmin;
