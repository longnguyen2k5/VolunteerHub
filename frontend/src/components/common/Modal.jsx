import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Box,
    Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

/**
 * Component Modal wrapper cho MUI Dialog.
 * Cung cấp cấu trúc chuẩn gồm Title, Content, Actions và nút đóng.
 */
const Modal = ({
    open = false,
    onClose,
    title,
    children,
    actions,
    maxWidth = 'sm',
    fullWidth = true,
    showCloseButton = true,
    dividers = true,
}) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth={maxWidth}
            fullWidth={fullWidth}
            PaperProps={{
                sx: {
                    borderRadius: 2,
                },
            }}
        >
            {title && (
                <DialogTitle>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Typography variant="h6" component="div">
                            {title}
                        </Typography>
                        {showCloseButton && (
                            <IconButton
                                aria-label="close"
                                onClick={onClose}
                                sx={{
                                    color: (theme) => theme.palette.grey[500],
                                }}
                            >
                                <CloseIcon />
                            </IconButton>
                        )}
                    </Box>
                </DialogTitle>
            )}

            <DialogContent dividers={dividers}>
                {children}
            </DialogContent>

            {actions && (
                <DialogActions sx={{ px: 3, py: 2 }}>
                    {actions}
                </DialogActions>
            )}
        </Dialog>
    );
};

export default Modal;
