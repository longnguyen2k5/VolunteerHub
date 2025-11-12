import React from 'react';
import { Snackbar, Alert, AlertTitle } from '@mui/material';

const Notification = ({
    open = false,
    onClose,
    message,
    title,
    severity = 'info', // 'success', 'error', 'warning', 'info'
    autoHideDuration = 6000,
    position = { vertical: 'top', horizontal: 'right' },
    variant = 'filled', // 'filled', 'outlined', 'standard'
}) => {
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        onClose && onClose();
    };

    return (
        <Snackbar
            open={open}
            autoHideDuration={autoHideDuration}
            onClose={handleClose}
            anchorOrigin={position}
        >
            <Alert
                onClose={handleClose}
                severity={severity}
                variant={variant}
                sx={{
                    width: '100%',
                    minWidth: 300,
                    boxShadow: 3,
                }}
            >
                {title && <AlertTitle>{title}</AlertTitle>}
                {message}
            </Alert>
        </Snackbar>
    );
};

export default Notification;
