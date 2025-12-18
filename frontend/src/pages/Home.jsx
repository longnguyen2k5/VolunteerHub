import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Button, Grid, Card, CardContent } from '@mui/material';
import { Handshake, Event, Group, Link } from '@mui/icons-material';

// 1. ĐỊNH NGHĨA DANH SÁCH ẢNH CỦA BẠN
// !!! QUAN TRỌNG: Hãy thay thế các URL này bằng 4 ảnh của bạn
const images = [
    'https://images.unsplash.com/photo-1582826310241-0cd9cc92dbb1?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1633',
    'https://plus.unsplash.com/premium_photo-1661775317533-2163ba4dbc93?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1174',
    'https://images.unsplash.com/photo-1565803974275-dccd2f933cbb?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1171', // hoạt động tình nguyện ngoài trời
    'https://images.pexels.com/photos/28662952/pexels-photo-28662952.jpeg'
];

// 2. ĐỊNH NGHĨA KEYFRAMES CHO HIỆU ỨNG KEN BURNS (PHÓNG TO/THU NHỎ)
const kenburns = {
    '@keyframes kenburns': {
        '0%': {
            transform: 'scale(1)',
        },
        '100%': {
            transform: 'scale(1.1)', // Phóng to lên 110%
        },
    },
};

const Home = () => {
    const navigate = useNavigate();

    // 3. TẠO STATE ĐỂ THEO DÕI SLIDE HIỆN TẠI
    const [currentSlide, setCurrentSlide] = useState(0);

    // 4. SỬ DỤNG EFFECT ĐỂ TỰ ĐỘNG CHUYỂN SLIDE MỖI 5 GIÂY
    useEffect(() => {
        const timer = setInterval(() => {
            // Chuyển đến slide tiếp theo, quay lại slide 0 nếu hết
            setCurrentSlide(prev => (prev + 1) % images.length);
        }, 5000); // 5000ms = 5 giây

        // Dọn dẹp interval khi component unmount
        return () => clearInterval(timer);
    }, []);


    return (
        <Box>
            {/* Hero Section */}
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
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: 0,
                    }}
                >
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

                {/* Dark Overlay Gradient */}
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

                {/* Hero Content */}
                <Container sx={{ position: 'relative', zIndex: 2 }}>
                    <Typography
                        variant="h1"
                        sx={{
                            fontWeight: 800,
                            fontSize: { xs: '3rem', md: '5rem' },
                            mb: 2,
                            // Fallback color
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
                        }}
                    >
                        Nhiệt huyết tình nguyện viên - Kết nối yêu thương
                        <br />
                        Chung tay xây dựng cộng đồng bền vững
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center' }}>
                        <Button
                            // REMOVED conflicted component={Link}
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

            {/* Impact Stats Section */}
            <Box sx={{ bgcolor: '#1a1a1a', py: 6, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <Container>
                    <Grid container spacing={4} justifyContent="center" sx={{ textAlign: 'center' }}>
                        {[
                            { number: '1.000+', label: 'Tình nguyện viên' },
                            { number: '500+', label: 'Sự kiện đã tổ chức' },
                            { number: '20.000+', label: 'Giờ đóng góp' },
                            { number: '50+', label: 'Đối tác' }
                        ].map((stat, index) => (
                            <Grid item xs={6} md={3} key={index}>
                                <Typography variant="h3" sx={{ fontWeight: 700, color: '#FE6B8B' }}>
                                    {stat.number}
                                </Typography>
                                <Typography variant="body1" sx={{ color: 'gray' }}>
                                    {stat.label}
                                </Typography>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Fields of Action Section */}
            <Box sx={{ py: 10, bgcolor: '#121212', position: 'relative' }}>
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
                    <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 700, color: 'white', mb: 1 }}>
                        Các lĩnh vực <span style={{ color: '#FF8E53' }}>hoạt động</span>
                    </Typography>
                    <Typography variant="h6" align="center" sx={{ mb: 8, color: 'rgba(255,255,255,0.6)', fontWeight: 300 }}>
                        Chúng tôi kết nối bạn với những sứ mệnh ý nghĩa nhất
                    </Typography>

                    <Grid container spacing={4} justifyContent="center">
                        {[
                            { title: 'Bảo vệ Môi trường', icon: '🌱', desc: 'Trồng cây, dọn rác, tái chế và bảo vệ thiên nhiên.' },
                            { title: 'Hỗ trợ Giáo dục', icon: '📚', desc: 'Dạy học, quyên góp sách và hỗ trợ trẻ em nghèo.' },
                            { title: 'Cứu trợ Xã hội', icon: '🤝', desc: 'Giúp đỡ người già neo đơn, người vô gia cư và cứu trợ thiên tai.' },
                            { title: 'Chăm sóc Sức khỏe', icon: '⚕️', desc: 'Hiến máu nhân đạo, tư vấn sức khỏe cộng đồng.' },
                        ].map((item, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        textAlign: 'center',
                                        p: 3,
                                        bgcolor: 'rgba(255, 255, 255, 0.03)',
                                        backdropFilter: 'blur(20px)',
                                        borderRadius: '24px',
                                        border: '1px solid rgba(255, 255, 255, 0.05)',
                                        color: 'white',
                                        transition: 'all 0.3s ease',
                                        cursor: 'pointer',
                                        '&:hover': {
                                            transform: 'translateY(-8px)',
                                            bgcolor: 'rgba(255, 255, 255, 0.06)',
                                            border: '1px solid #FE6B8B',
                                        }
                                    }}
                                >
                                    <CardContent>
                                        <Typography variant="h1" sx={{ mb: 2, fontSize: '4rem' }}>
                                            {item.icon}
                                        </Typography>
                                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                                            {item.title}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
                                            {item.desc}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* How It Works Section */}
            <Box sx={{ py: 10, bgcolor: '#0f0f0f' }}>
                <Container>
                    <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 700, color: 'white', mb: 6 }}>
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
                                    borderLeft: '2px solid #333',
                                    height: '100%',
                                    position: 'relative',
                                    transition: 'all 0.3s',
                                    '&:hover': {
                                        borderLeftColor: '#FF8E53',
                                        bgcolor: 'rgba(255,255,255,0.02)'
                                    }
                                }}>
                                    <Typography variant="h2" sx={{ color: 'rgba(255,255,255,0.1)', fontWeight: 900, position: 'absolute', top: 0, right: 20 }}>
                                        {step.step}
                                    </Typography>
                                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 1, position: 'relative' }}>
                                        {step.title}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'gray' }}>
                                        {step.desc}
                                    </Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* CTA Section */}
            <Box sx={{
                py: 12,
                background: 'linear-gradient(135deg, #1e1e1e 0%, #000000 100%)',
                color: 'white',
                borderTop: '1px solid rgba(255,255,255,0.05)'
            }}>
                <Container maxWidth="md">
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h3" gutterBottom sx={{ fontWeight: 800 }}>
                            Sẵn sàng tạo sự thay đổi?
                        </Typography>
                        <Typography variant="h6" sx={{ mb: 5, color: 'rgba(255,255,255,0.6)', fontWeight: 300 }}>
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
                                background: 'white',
                                color: 'black',
                                transition: 'all 0.3s',
                                '&:hover': {
                                    transform: 'scale(1.05)',
                                    boxShadow: '0 0 30px rgba(255,255,255,0.3)',
                                    bgcolor: '#f5f5f5'
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