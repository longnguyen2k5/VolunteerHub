import React from 'react';
import { TextField } from '@mui/material';

/**
 * Component Input wrapper cho MUI TextField.
 * Hỗ trợ các props chung như label, error, helperText, v.v.
 */
const Input = ({
    label,
    name,
    value,
    onChange,
    onBlur,
    type = 'text',
    placeholder,
    error = false,
    helperText,
    required = false,
    disabled = false,
    fullWidth = true,
    multiline = false,
    rows = 1,
    maxRows,
    variant = 'outlined',
    size = 'medium',
    InputProps,
    inputProps,
    sx = {},
    ...props
}) => {
    return (
        <TextField
            label={label}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            type={type}
            placeholder={placeholder}
            error={error}
            helperText={helperText}
            required={required}
            disabled={disabled}
            fullWidth={fullWidth}
            multiline={multiline}
            rows={multiline ? rows : undefined}
            maxRows={maxRows}
            variant={variant}
            size={size}
            InputProps={InputProps}
            inputProps={inputProps}
            sx={{
                '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                        borderColor: 'primary.main',
                    },
                },
                ...sx,
            }}
            {...props}
        />
    );
};

export default Input;
