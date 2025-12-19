import React from 'react';
import { Box, Container, Typography, Link, Grid, Stack, IconButton } from '@mui/material';
import { Facebook, Instagram, LinkedIn, Twitter, Email, Phone, LocationOn } from '@mui/icons-material';

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                bgcolor: '#050505',
                color: 'rgba(255,255,255,0.7)',
                pt: 8,
                pb: 4,
                mt: 'auto',
                borderTop: '1px solid rgba(255, 255, 255, 0.05)'
            }}
        >
            <Container maxWidth="xl">
                <Grid container spacing={5}>
                    {/* Brand Column */}
                    <Grid item xs={12} md={4}>
                        <Typography variant="h4" fontWeight={800} sx={{
                            background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mb: 2,
                            display: 'inline-block'
                        }}>
                            VolunteerHub
                        </Typography>
                        <Typography variant="body1" sx={{ maxWidth: 300, mb: 3, lineHeight: 1.8 }}>
                            Nền tảng kết nối tình nguyện viên hàng đầu, nơi lan tỏa yêu thương và tạo nên những thay đổi tích cực cho cộng đồng.
                        </Typography>
                        <Stack direction="row" spacing={1}>
                            {[Facebook, Instagram, LinkedIn, Twitter].map((Icon, index) => (
                                <IconButton key={index} sx={{
                                    color: 'white',
                                    bgcolor: 'rgba(255,255,255,0.05)',
                                    '&:hover': { bgcolor: '#FF8E53', transform: 'translateY(-3px)' },
                                    transition: 'all 0.3s'
                                }}>
                                    <Icon />
                                </IconButton>
                            ))}
                        </Stack>
                    </Grid>

                    {/* Quick Links */}
                    <Grid item xs={12} sm={6} md={2}>
                        <Typography variant="h6" fontWeight={700} color="white" gutterBottom>
                            Khám phá
                        </Typography>
                        <Stack spacing={1.5}>
                            {['Trang chủ', 'Sự kiện', 'Về chúng tôi', 'Blog', 'Liên hệ'].map((item) => (
                                <Link
                                    key={item}
                                    href="#"
                                    underline="none"
                                    color="inherit"
                                    sx={{
                                        transition: '0.2s',
                                        '&:hover': { color: '#FF8E53', pl: 1 }
                                    }}
                                >
                                    {item}
                                </Link>
                            ))}
                        </Stack>
                    </Grid>

                    {/* Help/Support */}
                    <Grid item xs={12} sm={6} md={2}>
                        <Typography variant="h6" fontWeight={700} color="white" gutterBottom>
                            Hỗ trợ
                        </Typography>
                        <Stack spacing={1.5}>
                            {['Trung tâm trợ giúp', 'Điều khoản sử dụng', 'Chính sách bảo mật', 'Câu hỏi thường gặp'].map((item) => (
                                <Link
                                    key={item}
                                    href="#"
                                    underline="none"
                                    color="inherit"
                                    sx={{
                                        transition: '0.2s',
                                        '&:hover': { color: '#FF8E53', pl: 1 }
                                    }}
                                >
                                    {item}
                                </Link>
                            ))}
                        </Stack>
                    </Grid>

                    {/* Contact Info */}
                    <Grid item xs={12} md={4}>
                        <Typography variant="h6" fontWeight={700} color="white" gutterBottom>
                            Liên hệ
                        </Typography>
                        <Stack spacing={2.5}>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <LocationOn sx={{ color: '#FF8E53', mt: 0.5 }} />
                                <Box>
                                    <Typography variant="subtitle2" color="white" fontWeight={600}>Địa chỉ</Typography>
                                    <Typography variant="body2">144 Xuân Thủy, Cầu Giấy, Hà Nội</Typography>
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Email sx={{ color: '#FE6B8B', mt: 0.5 }} />
                                <Box>
                                    <Typography variant="subtitle2" color="white" fontWeight={600}>Email</Typography>
                                    <Typography variant="body2">contact@volunteerhub.com</Typography>
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Phone sx={{ color: '#FF8E53', mt: 0.5 }} />
                                <Box>
                                    <Typography variant="subtitle2" color="white" fontWeight={600}>Hotline</Typography>
                                    <Typography variant="body2">+84 123 456 789</Typography>
                                </Box>
                            </Box>
                        </Stack>
                    </Grid>
                </Grid>

                <Box sx={{
                    mt: 8,
                    pt: 4,
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    textAlign: 'center'
                }}>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                        © 2025 VolunteerHub. All rights reserved. Designed with ❤️ for community.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;