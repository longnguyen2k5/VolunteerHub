import axiosInstance from './axiosConfig';

export const postAPI = {
    /**
     * Lấy danh sách bài viết trong sự kiện
     */
    getEventPosts: (eventId) => {
        return axiosInstance.get(`/events/${eventId}/posts`);
    },

    /**
     * Đăng bài viết mới trong sự kiện
     */
    createPost: (eventId, content) => {
        return axiosInstance.post(`/events/${eventId}/posts`, { content });
    },

    /**
     * Cập nhật bài viết
     */
    updatePost: (eventId, postId, content) => {
        return axiosInstance.put(`/events/${eventId}/posts/${postId}`, { content });
    },

    /**
     * Xóa bài viết
     */
    deletePost: (eventId, postId) => {
        return axiosInstance.delete(`/events/${eventId}/posts/${postId}`);
    },

    /**
     * Thích bài viết
     */
    likePost: (eventId, postId) => {
        return axiosInstance.post(`/events/${eventId}/posts/${postId}/like`);
    },

    /**
     * Bỏ thích bài viết
     */
    unlikePost: (eventId, postId) => {
        return axiosInstance.delete(`/events/${eventId}/posts/${postId}/like`);
    },

    /**
     * Lấy danh sách bình luận của bài viết
     */
    getComments: (eventId, postId) => {
        return axiosInstance.get(`/events/${eventId}/posts/${postId}/comments`);
    },

    /**
     * Bình luận vào bài viết
     */
    createComment: (eventId, postId, content) => {
        return axiosInstance.post(`/events/${eventId}/posts/${postId}/comments`, { content });
    },

    /**
     * Cập nhật bình luận
     */
    updateComment: (eventId, postId, commentId, content) => {
        return axiosInstance.put(`/events/${eventId}/posts/${postId}/comments/${commentId}`, { content });
    },

    /**
     * Xóa bình luận
     */
    deleteComment: (eventId, postId, commentId) => {
        return axiosInstance.delete(`/events/${eventId}/posts/${postId}/comments/${commentId}`);
    },
};
