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
import { useThemeContext } from '../../context/ThemeContext';

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
    const { glassSx } = useThemeContext();

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
        <Container maxWidth="sm" sx={{ py: 8 }}>
            <Paper elevation={0} sx={{
                p: 5,
                ...glassSx,
                borderRadius: '24px',
                color: 'text.primary',
            }}>
                <Typography variant="h4" component="h1" gutterBottom fontWeight={800} textAlign="center" sx={{
                    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 4
                }}>
                    Tạo Tài Khoản Admin
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                <form onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                        <TextField
                            label="Họ và tên"
                            name="fullName"
                            fullWidth
                            required
                            value={formData.fullName}
                            onChange={handleChange}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    color: 'text.primary',
                                    '& fieldset': { borderColor: 'divider' },
                                    '&:hover fieldset': { borderColor: 'text.primary' },
                                    '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                                },
                                '& .MuiInputLabel-root': { color: 'text.secondary' },
                                '& .MuiInputLabel-root.Mui-focused': { color: 'primary.main' }
                            }}
                        />

                        <TextField
                            label="Email"
                            name="email"
                            type="email"
                            fullWidth
                            required
                            value={formData.email}
                            onChange={handleChange}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    color: 'text.primary',
                                    '& fieldset': { borderColor: 'divider' },
                                    '&:hover fieldset': { borderColor: 'text.primary' },
                                    '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                                },
                                '& .MuiInputLabel-root': { color: 'text.secondary' },
                                '& .MuiInputLabel-root.Mui-focused': { color: 'primary.main' }
                            }}
                        />

                        <TextField
                            label="Mật khẩu"
                            name="password"
                            type="password"
                            fullWidth
                            required
                            value={formData.password}
                            onChange={handleChange}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    color: 'text.primary',
                                    '& fieldset': { borderColor: 'divider' },
                                    '&:hover fieldset': { borderColor: 'text.primary' },
                                    '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                                },
                                '& .MuiInputLabel-root': { color: 'text.secondary' },
                                '& .MuiInputLabel-root.Mui-focused': { color: 'primary.main' }
                            }}
                        />

                        <TextField
                            label="Nhập lại mật khẩu"
                            name="confirmPassword"
                            type="password"
                            fullWidth
                            required
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    color: 'text.primary',
                                    '& fieldset': { borderColor: 'divider' },
                                    '&:hover fieldset': { borderColor: 'text.primary' },
                                    '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                                },
                                '& .MuiInputLabel-root': { color: 'text.secondary' },
                                '& .MuiInputLabel-root.Mui-focused': { color: 'primary.main' }
                            }}
                        />

                        <Box sx={{ display: 'flex', gap: 2, pt: 2 }}>
                            <Button
                                variant="outlined"
                                color="secondary"
                                fullWidth
                                onClick={() => navigate('/admin/users')}
                                disabled={loading}
                                sx={{
                                    borderColor: 'divider',
                                    color: 'text.secondary',
                                    py: 1.5,
                                    borderRadius: '12px',
                                    '&:hover': {
                                        borderColor: 'text.primary',
                                        color: 'text.primary',
                                        bgcolor: 'action.hover'
                                    }
                                }}
                            >
                                Hủy
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                disabled={loading}
                                sx={{
                                    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                                    py: 1.5,
                                    borderRadius: '12px',
                                    fontSize: '1rem',
                                    fontWeight: 700,
                                    boxShadow: '0 4px 15px rgba(255, 105, 135, 0.3)'
                                }}
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
