import React from 'react';
import {
    Card as MuiCard,
    CardHeader,
    CardContent,
    CardActions,
    CardMedia,
    Divider,
} from '@mui/material';

/**
 * Component Card tái sử dụng, hỗ trợ header, media, content và actions.
 */
const Card = ({
    title,
    subtitle,
    avatar,
    action,
    image,
    imageHeight = 200,
    children,
    actions,
    elevation = 1,
    variant = 'outlined',
    sx = {},
    headerSx = {},
    contentSx = {},
    actionsSx = {},
    divider = false,
    ...props
}) => {
    return (
        <MuiCard
            elevation={elevation}
            variant={variant}
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 3,
                },
                ...sx,
            }}
            {...props}
        >
            {/* Header của Card (Tiêu đề, Avatar, Action) */}
            {(title || subtitle || avatar || action) && (
                <CardHeader
                    avatar={avatar}
                    action={action}
                    title={title}
                    subheader={subtitle}
                    sx={{
                        pb: divider ? 2 : 1,
                        ...headerSx,
                    }}
                />
            )}

            {divider && <Divider />}

            {/* Hình ảnh minh họa */}
            {image && (
                <CardMedia
                    component="img"
                    height={imageHeight}
                    image={image}
                    alt={title || 'Card image'}
                    sx={{
                        objectFit: 'cover',
                    }}
                />
            )}

            {/* Nội dung chính */}
            {children && (
                <CardContent
                    sx={{
                        flexGrow: 1,
                        ...contentSx,
                    }}
                >
                    {children}
                </CardContent>
            )}

            {/* Các hành động (Nút bấm) */}
            {actions && (
                <CardActions
                    sx={{
                        px: 2,
                        pb: 2,
                        ...actionsSx,
                    }}
                >
                    {actions}
                </CardActions>
            )}
        </MuiCard>
    );
};

export default Card;
