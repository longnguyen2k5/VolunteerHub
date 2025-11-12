import React from 'react';
import { Button as MuiButton, CircularProgress } from '@mui/material';

const Button = ({
    children,
    loading = false,
    disabled = false,
    variant = 'contained',
    color = 'primary',
    size = 'medium',
    fullWidth = false,
    startIcon,
    endIcon,
    onClick,
    type = 'button',
    sx = {},
    ...props
}) => {
    return (
        <MuiButton
            variant={variant}
            color={color}
            size={size}
            fullWidth={fullWidth}
            disabled={disabled || loading}
            startIcon={loading ? null : startIcon}
            endIcon={loading ? null : endIcon}
            onClick={onClick}
            type={type}
            sx={{
                position: 'relative',
                ...sx,
            }}
            {...props}
        >
            {loading && (
                <CircularProgress
                    size={20}
                    sx={{
                        position: 'absolute',
                        left: '50%',
                        marginLeft: '-10px',
                        color: 'inherit',
                    }}
                />
            )}
            <span style={{ visibility: loading ? 'hidden' : 'visible' }}>
                {children}
            </span>
        </MuiButton>
    );
};

export default Button;
