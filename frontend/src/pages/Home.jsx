import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Button, Grid, Card, CardContent } from '@mui/material';
import { Handshake, Event, Group, Link } from '@mui/icons-material';
import { useThemeContext } from '../context/ThemeContext';

// 1. DANH SÁCH ẢNH SLIDER
const images = [
    'https://images.unsplash.com/photo-1582826310241-0cd9cc92dbb1?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1633',
    'https://plus.unsplash.com/premium_photo-1661775317533-2163ba4dbc93?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1174',
    'https://images.unsplash.com/photo-1565803974275-dccd2f933cbb?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1171',
    'https://images.pexels.com/photos/28662952/pexels-photo-28662952.jpeg'
];

// 2. KEYFRAMES ANIMATION (Ken Burns effect)
const kenburns = {
    '@keyframes kenburns': {
        '0%': { transform: 'scale(1)' },
        '100%': { transform: 'scale(1.1)' },
    },
};

/**
 * Trang chủ của ứng dụng (Landing Page).
 * Giới thiệu về nền tảng VolunteerHub.
 */
const Home = () => {
    const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState(0);
    const { glassSx } = useThemeContext();

    // Tự động chuyển slide ảnh nền mỗi 5s
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);


    return (
        <Box sx={{ bgcolor: 'background.default', color: 'text.primary' }}>
            {/* Hero Section - Phần hiển thị chính đầu trang */}
            <Box
                sx={{
                    position: 'relative',
                    color: 'white',
                    overflow: 'hidden',
                    ...kenburns,
                    minHeight: '90vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                }}
            >
                {/* Background Slider */}
                <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
                    {images.map((image, index) => (
                        <Box
                            key={index}
                            component="img"
                            src={image}
                            alt={`Slide ${index + 1}`}
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                opacity: index === currentSlide ? 1 : 0,
                                transition: 'opacity 1.5s ease-in-out',
                                animation: index === currentSlide ? 'kenburns 10s ease-in-out infinite alternate' : 'none',
                            }}
                        />
                    ))}
                </Box>

                {/* Dark Overlay Gradient - Lớp phủ tối để làm nổi bật text */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 50%, rgba(18,18,18,1) 100%)',
                        zIndex: 1,
                    }}
                />

                {/* Hero Content - Nội dung tiêu đề và nút kêu gọi hành động */}
                <Container sx={{ position: 'relative', zIndex: 2 }}>
                    <Typography
                        variant="h1"
                        sx={{
                            fontWeight: 800,
                            fontSize: { xs: '3rem', md: '5rem' },
                            mb: 2,
                            color: '#FF8E53',
                            background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                        }}
                    >
                        VolunteerHub
                    </Typography>
                    <Typography
                        variant="h5"
                        sx={{
                            mb: 6,
                            opacity: 1,
                            fontWeight: 400,
                            maxWidth: '800px',
                            mx: 'auto',
                            lineHeight: 1.6,
                            textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                            color: 'white'
                        }}
                    >
                        Nhiệt huyết tình nguyện viên - Kết nối yêu thương
                        <br />
                        Chung tay xây dựng cộng đồng bền vững
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center' }}>
                        <Button
                            onClick={() => navigate('/register')}
                            variant="contained"
                            size="large"
                            sx={{
                                px: 5,
                                py: 1.5,
                                borderRadius: '50px',
                                fontSize: '1.1rem',
                                fontWeight: 600,
                                background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                                boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
                                transition: 'all 0.3s',
                                '&:hover': {
                                    transform: 'translateY(-3px)',
                                    boxShadow: '0 6px 15px 4px rgba(255, 105, 135, .4)',
                                }
                            }}
                        >
                            Đăng ký ngay
                        </Button>
                        <Button
                            onClick={() => navigate('/events')}
                            variant="outlined"
                            size="large"
                            sx={{
                                px: 5,
                                py: 1.5,
                                borderRadius: '50px',
                                fontSize: '1.1rem',
                                fontWeight: 600,
                                color: 'white',
                                borderColor: 'rgba(255,255,255,0.8)',
                                borderWidth: '2px',
                                backdropFilter: 'blur(5px)',
                                '&:hover': {
                                    borderColor: 'white',
                                    bgcolor: 'rgba(255,255,255,0.1)',
                                    transform: 'translateY(-3px)',
                                }
                            }}
                        >
                            Xem sự kiện
                        </Button>
                    </Box>
                </Container>
            </Box>


            {/* Các lĩnh vực hoạt động */}
            <Box sx={{ py: 10, bgcolor: 'background.default', position: 'relative' }}>
                <Box sx={{
                    position: 'absolute',
                    top: '10%',
                    right: '-10%',
                    width: '600px',
                    height: '600px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(255,142,83,0.05) 0%, rgba(0,0,0,0) 70%)',
                }} />

                <Container>
                    <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
                        Các lĩnh vực <span style={{ color: '#FF8E53' }}>hoạt động</span>
                    </Typography>
                    <Typography variant="h6" align="center" sx={{ mb: 8, color: 'text.secondary', fontWeight: 300 }}>
                        Chúng tôi kết nối bạn với những sứ mệnh ý nghĩa nhất
                    </Typography>

                    <Grid container spacing={4} justifyContent="center">
                        {[
                            { title: 'Bảo vệ Môi trường', icon: '🌱', desc: 'Trồng cây, dọn rác, tái chế và bảo vệ thiên nhiên.' },
                            { title: 'Hỗ trợ Giáo dục', icon: '📚', desc: 'Dạy học, quyên góp sách và hỗ trợ trẻ em nghèo.' },
                            { title: 'Cứu trợ Xã hội', icon: '🤝', desc: 'Giúp đỡ người già neo đơn, người vô gia cư và cứu trợ thiên tai.' },
                            { title: 'Chăm sóc Sức khỏe', icon: '⚕️', desc: 'Hiến máu nhân đạo, tư vấn sức khỏe cộng đồng.' },
                        ].map((item, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index} sx={{ display: 'flex' }}>
                                <Card
                                    sx={{
                                        width: '100%',
                                        minHeight: '320px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        textAlign: 'center',
                                        p: 2,
                                        ...glassSx,
                                        borderRadius: '24px',
                                        color: 'text.primary',
                                        transition: 'all 0.3s ease',
                                        cursor: 'pointer',
                                        position: 'relative',
                                        overflow: 'visible',
                                        '&:hover': {
                                            transform: 'translateY(-8px)',
                                            bgcolor: 'action.hover',
                                            boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)',
                                            border: '1px solid #FE6B8B',
                                        }
                                    }}
                                >
                                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <Box sx={{
                                            width: 80,
                                            height: 80,
                                            borderRadius: '50%',
                                            bgcolor: 'rgba(254, 107, 139, 0.1)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mb: 2,
                                            fontSize: '3rem'
                                        }}>
                                            {item.icon}
                                        </Box>
                                        <Typography variant="h6" gutterBottom sx={{
                                            fontWeight: 700,
                                            minHeight: '3.5rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            mb: 1
                                        }}>
                                            {item.title}
                                        </Typography>
                                        <Typography variant="body2" sx={{
                                            color: 'text.secondary',
                                            lineHeight: 1.6,
                                            minHeight: '3rem'
                                        }}>
                                            {item.desc}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Quy trình tham gia */}
            <Box sx={{ py: 10, bgcolor: 'background.paper' }}>
                <Container>
                    <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 700, color: 'text.primary', mb: 6 }}>
                        Quy trình tham gia
                    </Typography>
                    <Grid container spacing={4} justifyContent="center" sx={{ position: 'relative' }}>
                        {[
                            { step: '01', title: 'Đăng ký tài khoản', desc: 'Tạo hồ sơ tình nguyện viên của bạn chỉ trong 30 giây.' },
                            { step: '02', title: 'Tìm kiếm sự kiện', desc: 'Lựa chọn hoạt động phù hợp với sở thích và thời gian.' },
                            { step: '03', title: 'Tham gia', desc: 'Góp sức mình vào các hoạt động thực tế đầy ý nghĩa.' },
                            { step: '04', title: 'Nhận chứng nhận', desc: 'Được ghi nhận đóng góp và nhận giấy chứng nhận Online.' }
                        ].map((step, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <Box sx={{
                                    p: 3,
                                    borderLeft: '2px solid',
                                    borderColor: 'divider',
                                    height: '100%',
                                    position: 'relative',
                                    transition: 'all 0.3s',
                                    '&:hover': {
                                        borderLeftColor: '#FF8E53',
                                        bgcolor: 'action.hover'
                                    }
                                }}>
                                    <Typography variant="h2" sx={{ color: 'text.disabled', fontWeight: 900, position: 'absolute', top: 0, right: 20, opacity: 0.2 }}>
                                        {step.step}
                                    </Typography>
                                    <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 700, mb: 1, position: 'relative' }}>
                                        {step.title}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        {step.desc}
                                    </Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* CTA Section - Kêu gọi tham gia cuối trang */}
            <Box sx={{
                py: 12,
                bgcolor: 'background.paper',
                color: 'text.primary',
                borderTop: '1px solid',
                borderColor: 'divider'
            }}>
                <Container maxWidth="md">
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h3" gutterBottom sx={{ fontWeight: 800 }}>
                            Sẵn sàng tạo sự thay đổi?
                        </Typography>
                        <Typography variant="h6" sx={{ mb: 5, color: 'text.secondary', fontWeight: 300 }}>
                            Tham gia cùng hàng nghìn tình nguyện viên khác và bắt đầu hành trình ý nghĩa của bạn ngay hôm nay.
                        </Typography>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => navigate('/register')}
                            sx={{
                                px: 6,
                                py: 2,
                                borderRadius: '50px',
                                fontSize: '1.2rem',
                                fontWeight: 700,
                                background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                                color: 'white',
                                boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
                                transition: 'all 0.3s',
                                '&:hover': {
                                    transform: 'scale(1.05)',
                                    boxShadow: '0 6px 15px 4px rgba(255, 105, 135, .4)',
                                }
                            }}
                        >
                            Bắt đầu ngay
                        </Button>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
};

export default Home;