import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

/**
 * Component LoadingSpinner hiển thị vòng quay loading.
 * Hỗ trợ chế độ toàn màn hình hoặc nằm trong container.
 */
const LoadingSpinner = ({
    size = 40,
    thickness = 4,
    message = 'Đang tải...',
    fullScreen = false,
    color = 'primary',
    showMessage = true,
}) => {
    const content = (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            gap={2}
        >
            <CircularProgress
                size={size}
                thickness={thickness}
                color={color}
            />
            {showMessage && message && (
                <Typography variant="body2" color="text.secondary">
                    {message}
                </Typography>
            )}
        </Box>
    );

    if (fullScreen) {
        return (
            <Box
                sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    zIndex: 9999,
                }}
            >
                {content}
            </Box>
        );
    }

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 200,
                width: '100%',
            }}
        >
            {content}
        </Box>
    );
};

export default LoadingSpinner;
