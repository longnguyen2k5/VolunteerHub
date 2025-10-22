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

    // --- BẮT ĐẦU PHẦN THÊM MỚI ---

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

    // --- KẾT THÚC PHẦN THÊM MỚI ---

    const features = [
        {
            icon: <Event sx={{ fontSize: 60, color: 'primary.main' }} />,
            title: 'Sự kiện đa dạng',
            description: 'Tham gia các hoạt động tình nguyện ý nghĩa: trồng cây, dọn rác, từ thiện...'
        },
        {
            icon: <Handshake sx={{ fontSize: 60, color: 'secondary.main' }} />,
            title: 'Cộng đồng nhiệt huyết',
            description: 'Kết nối với hàng nghìn tình nguyện viên trên khắp cả nước'
        },
        {
            icon: <Group sx={{ fontSize: 60, color: 'success.main' }} />,
            title: 'Quản lý dễ dàng',
            description: 'Công cụ tổ chức và quản lý sự kiện chuyên nghiệp, hiệu quả'
        },
        {
            icon: <Link sx={{ fontSize: 60, color: 'info.main' }} />,
            title: 'Kết nối hiệu quả',
            description: 'Cầu nối giữa tổ chức và tình nguyện viên, giúp tìm kiếm và tham gia sự kiện'
        },
    ];

    return (
        <Box>
            {/* Hero Section - ĐÃ CẬP NHẬT */}
            <Box
                sx={{
                    position: 'relative', // Cần thiết để chứa các ảnh absolute
                    color: 'white',
                    overflow: 'hidden', // Ẩn phần ảnh bị zoom ra ngoài
                    ...kenburns, // Áp dụng định nghĩa @keyframes

                    // --- PHẦN SỬA ĐỔI CHIỀU CAO ---
                    // Xóa 'py: 10' và thay bằng:
                    minHeight: '80vh', // Đặt chiều cao tối thiểu là 60% chiều cao màn hình

                    // Thêm các thuộc tính flexbox để căn giữa nội dung
                    display: 'flex',
                    alignItems: 'center',    // Căn giữa theo chiều dọc
                    justifyContent: 'center', // Căn giữa theo chiều ngang
                    textAlign: 'center',
                    // --- KẾT THÚC SỬA ĐỔI ---
                }}
            >
                {/* 5. LỚP SLIDER ẢNH (NỀN) */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: 0, // Nằm dưới cùng
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
                                objectFit: 'cover', // Đảm bảo ảnh che phủ toàn bộ

                                // HIỆU ỨNG FADE (OPACITY)
                                opacity: index === currentSlide ? 1 : 0,
                                transition: 'opacity 1.5s ease-in-out', // Thời gian chuyển mờ

                                // HIỆU ỨNG KEN BURNS (ZOOM)
                                // Chỉ áp dụng cho slide đang active
                                animation:
                                    index === currentSlide
                                        ? 'kenburns 7s ease-in-out infinite alternate' // Chạy 7s, lặp lại và đảo ngược (zoom ra/vào)
                                        : 'none',
                            }}
                        />
                    ))}
                </Box>

                {/* 6. LỚP PHỦ MỜ (ĐỂ CHỮ DỄ ĐỌC HƠN) */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        bgcolor: 'rgba(0, 0, 0, 0.4)', // Lớp phủ đen 40%
                        zIndex: 1, // Nằm trên ảnh
                    }}
                />

                {/* 7. LỚP NỘI DUNG (TEXT VÀ BUTTONS) */}
                <Container
                    sx={{
                        position: 'relative', // Phải là relative
                        zIndex: 2, // Nằm trên lớp phủ
                    }}
                >
                    <Typography variant="h2" gutterBottom>
                        VolunteerHub
                    </Typography>
                    <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
                        Nhiệt huyết tình nguyện viên - Kết nối yêu thương
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                        <Button
                            variant="outlined"
                            size="large"
                            sx={{
                                color: 'white',
                                borderColor: 'white',
                                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' } // Thêm hiệu ứng hover
                            }}
                            onClick={() => navigate('/register')}
                        >
                            Đăng ký ngay
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            sx={{
                                color: 'white',
                                borderColor: 'white',
                                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' } // Thêm hiệu ứng hover
                            }}
                            onClick={() => navigate('/events')}
                        >
                            Xem sự kiện
                        </Button>
                    </Box>
                </Container>
            </Box>

            {/* Features Section */}
            <Container sx={{ py: 8 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Tại sao chọn VolunteerHub?
                </Typography>
                <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 6 }}>
                    Nền tảng tình nguyện hàng đầu Việt Nam
                </Typography>

                <Grid container spacing={4} justifyContent="center">
                    {features.map((feature, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                            <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
                                <CardContent>
                                    <Box sx={{ mb: 2 }}>
                                        {feature.icon}
                                    </Box>
                                    <Typography variant="h6" gutterBottom>
                                        {feature.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {feature.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* CTA Section */}
            <Box sx={{ bgcolor: 'grey.100', py: 8 }}>
                <Container>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" gutterBottom>
                            Sẵn sàng tạo sự thay đổi?
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                            Hãy tham gia cùng chúng tôi ngay hôm nay!
                        </Typography>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => navigate('/register')}
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