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
        // Optimistic update
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
        setPosts(updatedPosts);

        try {
            if (currentLikeStatus) {
                await postAPI.unlikePost(id, postId);
            } else {
                await postAPI.likePost(id, postId);
            }
        } catch (error) {
            // Revert on error
            toast.error('Thao tác thất bại');
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
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Button
                startIcon={<ArrowBack />}
                onClick={() => navigate(`/events/${id}`)}
                sx={{ mb: 2 }}
            >
                Quay lại sự kiện
            </Button>

            <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Typography variant="h4" gutterBottom>{event.name}</Typography>
                <Typography variant="subtitle1" color="text.secondary">Kênh thảo luận</Typography>
            </Box>

            {/* Create Post Widget */}
            <Card sx={{ mb: 4 }}>
                <CardContent>
                    <Stack direction="row" spacing={2} alignItems="flex-start">
                        <Avatar sx={{ bgcolor: 'primary.main' }}>{user?.fullName?.charAt(0)}</Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                            <TextField
                                fullWidth
                                placeholder="Bạn đang nghĩ gì về sự kiện này?"
                                multiline
                                rows={3}
                                value={newPostContent}
                                onChange={(e) => setNewPostContent(e.target.value)}
                                sx={{ mb: 1 }}
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Button
                                    variant="contained"
                                    endIcon={<Send />}
                                    onClick={handleCreatePost}
                                    disabled={!newPostContent.trim()}
                                >
                                    Đăng bài
                                </Button>
                            </Box>
                        </Box>
                    </Stack>
                </CardContent>
            </Card>

            <Divider sx={{ mb: 4 }}>
                <Chip label="Bảng tin" />
            </Divider>

            {/* Posts Feed */}
            <Stack spacing={3}>
                {posts.length === 0 && (
                    <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                        <Typography>Chưa có bài viết nào. Hãy là người đầu tiên đăng bài!</Typography>
                    </Box>
                )}
                {posts.map(post => (
                    <Card key={post.id} sx={{ bgcolor: '#f9f9f9' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Avatar>{post.userName?.charAt(0)}</Avatar>
                                    <Box>
                                        <Typography variant="subtitle2">{post.userName}</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: vi })}
                                        </Typography>
                                    </Box>
                                </Stack>
                                {(user?.id === post.userId || user?.role === 'ADMIN' || user?.role === 'EVENT_MANAGER') && (
                                    <IconButton size="small" onClick={() => handleDeletePost(post.id)}>
                                        <Delete fontSize="small" />
                                    </IconButton>
                                )}
                            </Box>

                            <Typography variant="body1" paragraph style={{ whiteSpace: 'pre-line' }}>
                                {post.content}
                            </Typography>

                            <Divider sx={{ my: 1 }} />

                            <Stack direction="row" spacing={2}>
                                <Button
                                    size="small"
                                    startIcon={post.isLikedByCurrentUser ? <ThumbUp /> : <ThumbUpOutlined />}
                                    color={post.isLikedByCurrentUser ? "primary" : "inherit"}
                                    onClick={() => handleLikePost(post.id, post.isLikedByCurrentUser)}
                                >
                                    {post.likeCount} Thích
                                </Button>
                                <Button
                                    size="small"
                                    startIcon={<CommentIcon />}
                                    color="inherit"
                                    onClick={() => toggleComments(post.id)}
                                >
                                    {post.commentCount} Bình luận
                                </Button>
                            </Stack>

                            {/* Comments Section */}
                            {expandedComments[post.id] && (
                                <Box sx={{ mt: 2, pl: 2, borderLeft: '2px solid #ddd' }}>
                                    {/* Comments List */}
                                    <Stack spacing={2} sx={{ mb: 2 }}>
                                        {commentsMap[post.id]?.map(comment => (
                                            <Box key={comment.id} sx={{ bgcolor: 'white', p: 1.5, borderRadius: 1 }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <Typography variant="subtitle2" sx={{ fontSize: '0.875rem' }}>
                                                        {comment.userName}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {formatDistanceToNow(new Date(comment.createdAt), { locale: vi })}
                                                    </Typography>
                                                </Box>
                                                <Typography variant="body2">{comment.content}</Typography>
                                                {(user?.id === comment.userId || user?.role === 'ADMIN') && (
                                                    <Typography
                                                        variant="caption"
                                                        sx={{ cursor: 'pointer', color: 'error.main' }}
                                                        onClick={() => handleDeleteComment(post.id, comment.id)}
                                                    >
                                                        Xóa
                                                    </Typography>
                                                )}
                                            </Box>
                                        ))}
                                    </Stack>

                                    {/* New Comment Input */}
                                    <Stack direction="row" spacing={1}>
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
                                        />
                                        <IconButton color="primary" onClick={() => handleCreateComment(post.id)}>
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
