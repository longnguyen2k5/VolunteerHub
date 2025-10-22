import React from 'react';
import { Box, Container, Typography, Link } from '@mui/material';

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                py: 3,
                px: 2,
                mt: 'auto',
                backgroundColor: (theme) => theme.palette.grey[200],
            }}
        >
            <Container maxWidth="lg">
                <Typography variant="body2" color="text.secondary" align="center">
                    © 2025 VolunteerHub. Nhiệt huyết tình nguyện viên.
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                    <Link href="#" color="inherit" sx={{ mx: 1 }}>
                        Về chúng tôi
                    </Link>
                    |
                    <Link href="#" color="inherit" sx={{ mx: 1 }}>
                        Liên hệ
                    </Link>
                    |
                    <Link href="#" color="inherit" sx={{ mx: 1 }}>
                        Chính sách
                    </Link>
                </Typography>
            </Container>
        </Box>
    );
};

export default Footer;