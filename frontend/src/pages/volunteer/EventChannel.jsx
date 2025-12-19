import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    Avatar,
    TextField,
    IconButton,
    Divider,
    Stack,
    CircularProgress,
    Tooltip,
    Chip
} from '@mui/material';
import {
    ArrowBack,
    Send,
    ThumbUp,
    ThumbUpOutlined,
    Comment as CommentIcon,
    Delete
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { toast } from 'react-toastify';
import { postAPI } from '../../api/postApi';
import { eventAPI } from '../../api/eventApi';
import { useAuth } from '../../hooks/useAuth';

const EventChannel = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [event, setEvent] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newPostContent, setNewPostContent] = useState('');

    // State for managing comments expansion and input per post
    const [expandedComments, setExpandedComments] = useState({}); // { postId: boolean }
    const [commentsMap, setCommentsMap] = useState({}); // { postId: Comment[] }
    const [newCommentContent, setNewCommentContent] = useState({}); // { postId: string }

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            const [eventRes, postsRes] = await Promise.all([
                eventAPI.getById(id),
                postAPI.getEventPosts(id)
            ]);
            setEvent(eventRes.data);

            setPosts(postsRes.data);
        } catch (error) {
            console.error("Error fetching channel data:", error);
            toast.error(error.response?.data?.message || 'Không thể tải dữ liệu kênh thảo luận');
            // navigate(`/events/${id}`); // Don't redirect, let user see error
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePost = async () => {
        if (!newPostContent.trim()) return;
        try {
            const response = await postAPI.createPost(id, newPostContent);
            setPosts([response.data, ...posts]);
            setNewPostContent('');
            toast.success('Đã đăng bài viết mới');
        } catch (error) {
            toast.error('Không thể đăng bài');
        }
    };

    const handleDeletePost = async (postId) => {
        if (!window.confirm('Bạn có chắc muốn xóa bài viết này?')) return;
        try {
            await postAPI.deletePost(id, postId);
            setPosts(posts.filter(p => p.id !== postId));
            toast.success('Đã xóa bài viết');
        } catch (error) {
            toast.error('Không thể xóa bài viết');
        }
    };

    const handleLikePost = async (postId, currentLikeStatus) => {
        // Optimistic update (providing instant feedback)
        const updatedPosts = posts.map(p => {
            if (p.id === postId) {
                return {
                    ...p,
                    isLikedByCurrentUser: !p.isLikedByCurrentUser,
                    likeCount: p.isLikedByCurrentUser ? p.likeCount - 1 : p.likeCount + 1
                };
            }
            return p;
        });
        setPosts(updatedPosts); // Show optimistic state immediately

        try {
            let response;
            if (currentLikeStatus) {
                console.log("Calling API: UNLIKE");
                response = await postAPI.unlikePost(id, postId);
            } else {
                console.log("Calling API: LIKE");
                response = await postAPI.likePost(id, postId);
            }

            // Authoritative Update from Server
            const { isLiked, likeCount } = response.data;

            setPosts(currentPosts => currentPosts.map(p => {
                if (p.id === postId) {
                    return {
                        ...p,
                        isLikedByCurrentUser: isLiked, // Use server truth
                        likeCount: likeCount           // Use server truth
                    };
                }
                return p;
            }));

        } catch (error) {
            console.error("API Failed", error);
            toast.error('Thao tác thất bại');
            // Revert state on error (reload from server)
            fetchData();
        }
    };

    const toggleComments = async (postId) => {
        const isExpanded = !!expandedComments[postId];
        setExpandedComments({
            ...expandedComments,
            [postId]: !isExpanded
        });

        if (!isExpanded && !commentsMap[postId]) {
            // Fetch comments if opening and not loaded yet
            try {
                const res = await postAPI.getComments(id, postId);
                setCommentsMap({
                    ...commentsMap,
                    [postId]: res.data
                });
            } catch (error) {
                console.error("Failed to load comments", error);
            }
        }
    };

    const handleCreateComment = async (postId) => {
        const content = newCommentContent[postId];
        if (!content?.trim()) return;

        try {
            const res = await postAPI.createComment(id, postId, content);
            const currentComments = commentsMap[postId] || [];

            setCommentsMap({
                ...commentsMap,
                [postId]: [...currentComments, res.data]
            });

            setNewCommentContent({
                ...newCommentContent,
                [postId]: ''
            });

            // Update comment count in post list UI
            setPosts(posts.map(p => p.id === postId ? { ...p, commentCount: p.commentCount + 1 } : p));

        } catch (error) {
            toast.error('Không thể bình luận');
        }
    };

    const handleDeleteComment = async (postId, commentId) => {
        if (!window.confirm('Xóa bình luận?')) return;
        try {
            await postAPI.deleteComment(id, postId, commentId);
            setCommentsMap({
                ...commentsMap,
                [postId]: commentsMap[postId].filter(c => c.id !== commentId)
            });
            setPosts(posts.map(p => p.id === postId ? { ...p, commentCount: p.commentCount - 1 } : p));
        } catch (error) {
            toast.error('Lỗi khi xóa bình luận');
        }
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    if (!event) return null;

    return (
        <Container maxWidth="md" sx={{ py: 6, position: 'relative', minHeight: '100vh', pb: 10 }}>
            {/* Back Button */}
            <Button
                startIcon={<ArrowBack />}
                onClick={() => navigate(`/events/${id}`)}
                sx={{
                    mb: 4,
                    color: 'white',
                    bgcolor: 'rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(10px)',
                    px: 3,
                    py: 1,
                    borderRadius: '30px',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                }}
            >
                Quay lại sự kiện
            </Button>

            <Box sx={{ mb: 6, textAlign: 'center' }}>
                <Typography variant="h3" fontWeight={800} gutterBottom sx={{
                    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}>
                    {event.name}
                </Typography>
                <Chip
                    label="Kênh thảo luận"
                    sx={{
                        bgcolor: 'rgba(255,255,255,0.1)',
                        color: '#FF8E53',
                        fontWeight: 600,
                        border: '1px solid rgba(255,255,255,0.2)'
                    }}
                />
            </Box>

            {/* Create Post Widget */}
            <Card sx={{
                mb: 6,
                bgcolor: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '24px',
                overflow: 'visible'
            }}>
                <CardContent sx={{ p: 3 }}>
                    <Stack direction="row" spacing={3} alignItems="flex-start">
                        <Avatar sx={{
                            bgcolor: 'primary.main',
                            width: 48,
                            height: 48,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                        }}>
                            {user?.fullName?.charAt(0)}
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                            <TextField
                                fullWidth
                                placeholder="Bạn đang nghĩ gì về sự kiện này?"
                                multiline
                                rows={3}
                                value={newPostContent}
                                onChange={(e) => setNewPostContent(e.target.value)}
                                sx={{
                                    mb: 2,
                                    '& .MuiOutlinedInput-root': {
                                        color: 'white',
                                        bgcolor: 'rgba(0,0,0,0.2)',
                                        borderRadius: '16px',
                                        '& fieldset': { borderColor: 'transparent' },
                                        '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                                        '&.Mui-focused fieldset': { borderColor: '#FF8E53' },
                                    },
                                    '& .MuiInputBase-input::placeholder': { color: 'rgba(255,255,255,0.4)' }
                                }}
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Button
                                    variant="contained"
                                    endIcon={<Send />}
                                    onClick={handleCreatePost}
                                    disabled={!newPostContent.trim()}
                                    sx={{
                                        borderRadius: '20px',
                                        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                                        boxShadow: '0 4px 15px rgba(254, 107, 139, 0.3)',
                                        textTransform: 'none',
                                        fontWeight: 600
                                    }}
                                >
                                    Đăng bài
                                </Button>
                            </Box>
                        </Box>
                    </Stack>
                </CardContent>
            </Card>

            <Divider sx={{ mb: 6, '&::before, &::after': { borderColor: 'rgba(255,255,255,0.1)' } }}>
                <Chip label="Bảng tin" sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white' }} />
            </Divider>

            {/* Posts Feed */}
            <Stack spacing={4}>
                {posts.length === 0 && (
                    <Box sx={{ textAlign: 'center', py: 8, color: 'rgba(255,255,255,0.5)' }}>
                        <CommentIcon sx={{ fontSize: 60, mb: 2, opacity: 0.5 }} />
                        <Typography variant="h6">Chưa có bài viết nào.</Typography>
                        <Typography variant="body2">Hãy là người đầu tiên bắt đầu cuộc trò chuyện!</Typography>
                    </Box>
                )}
                {posts.map(post => (
                    <Card key={post.id} sx={{
                        bgcolor: 'rgba(255, 255, 255, 0.03)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        borderRadius: '20px',
                        color: 'white'
                    }}>
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: '#FF8E53' }}>
                                        {post.userName?.charAt(0)}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight={600} sx={{ color: '#FF8E53' }}>
                                            {post.userName}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                                            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: vi })}
                                        </Typography>
                                    </Box>
                                </Stack>
                                {(user?.id === post.userId || user?.role === 'ADMIN' || user?.role === 'EVENT_MANAGER') && (
                                    <IconButton size="small" onClick={() => handleDeletePost(post.id)} sx={{ color: 'rgba(255,255,255,0.3)', '&:hover': { color: '#ff1744' } }}>
                                        <Delete fontSize="small" />
                                    </IconButton>
                                )}
                            </Box>

                            <Typography variant="body1" paragraph style={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}>
                                {post.content}
                            </Typography>

                            <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.1)' }} />

                            <Stack direction="row" spacing={1}>
                                <Button
                                    size="small"
                                    startIcon={post.isLikedByCurrentUser ? <ThumbUp /> : <ThumbUpOutlined />}
                                    color={post.isLikedByCurrentUser ? "primary" : "inherit"}
                                    onClick={() => handleLikePost(post.id, post.isLikedByCurrentUser)}
                                    sx={{
                                        color: post.isLikedByCurrentUser ? '#FF8E53' : 'rgba(255,255,255,0.7)',
                                        borderRadius: '20px',
                                        textTransform: 'none'
                                    }}
                                >
                                    {post.likeCount} Thích
                                </Button>
                                <Button
                                    size="small"
                                    startIcon={<CommentIcon />}
                                    sx={{ color: 'rgba(255,255,255,0.7)', borderRadius: '20px', textTransform: 'none' }}
                                    onClick={() => toggleComments(post.id)}
                                >
                                    {post.commentCount} Bình luận
                                </Button>
                            </Stack>

                            {/* Comments Section */}
                            {expandedComments[post.id] && (
                                <Box sx={{ mt: 3, pl: 0 }}>
                                    {/* Comments List */}
                                    <Stack spacing={2} sx={{ mb: 3 }}>
                                        {commentsMap[post.id]?.map(comment => (
                                            <Box key={comment.id} sx={{
                                                bgcolor: 'rgba(0,0,0,0.3)',
                                                p: 2,
                                                borderRadius: '16px',
                                                border: '1px solid rgba(255,255,255,0.05)'
                                            }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                    <Typography variant="subtitle2" sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#e0e0e0' }}>
                                                        {comment.userName}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                                                        {formatDistanceToNow(new Date(comment.createdAt), { locale: vi })}
                                                    </Typography>
                                                </Box>
                                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                                                    {comment.content}
                                                </Typography>
                                                {(user?.id === comment.userId || user?.role === 'ADMIN') && (
                                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0.5 }}>
                                                        <Typography
                                                            variant="caption"
                                                            sx={{ cursor: 'pointer', color: 'rgba(255,255,255,0.4)', '&:hover': { color: '#ff1744' } }}
                                                            onClick={() => handleDeleteComment(post.id, comment.id)}
                                                        >
                                                            Xóa
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </Box>
                                        ))}
                                    </Stack>

                                    {/* New Comment Input */}
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <TextField
                                            size="small"
                                            fullWidth
                                            placeholder="Viết bình luận..."
                                            value={newCommentContent[post.id] || ''}
                                            onChange={(e) => setNewCommentContent({
                                                ...newCommentContent,
                                                [post.id]: e.target.value
                                            })}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleCreateComment(post.id);
                                                    e.preventDefault();
                                                }
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    bgcolor: 'rgba(0,0,0,0.2)',
                                                    borderRadius: '20px',
                                                    color: 'white',
                                                    '& fieldset': { border: 'none' },
                                                },
                                                '& input::placeholder': { color: 'rgba(255,255,255,0.4)' }
                                            }}
                                        />
                                        <IconButton
                                            onClick={() => handleCreateComment(post.id)}
                                            disabled={!newCommentContent[post.id]?.trim()}
                                            sx={{
                                                color: '#FF8E53',
                                                bgcolor: 'rgba(255,142,83,0.1)',
                                                '&:hover': { bgcolor: 'rgba(255,142,83,0.2)' }
                                            }}
                                        >
                                            <Send />
                                        </IconButton>
                                    </Stack>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </Stack>
        </Container>
    );
};

export default EventChannel;
