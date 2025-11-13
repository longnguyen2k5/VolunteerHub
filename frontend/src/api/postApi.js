import axiosInstance from './axiosConfig';

export const postAPI = {
    /**
     * Get all posts in an event discussion
     */
    getEventPosts: (eventId) => {
        return axiosInstance.get(`/events/${eventId}/posts`);
    },

    /**
     * Create a new post in event discussion
     */
    createPost: (eventId, content) => {
        return axiosInstance.post(`/events/${eventId}/posts`, { content });
    },

    /**
     * Update a post
     */
    updatePost: (eventId, postId, content) => {
        return axiosInstance.put(`/events/${eventId}/posts/${postId}`, { content });
    },

    /**
     * Delete a post
     */
    deletePost: (eventId, postId) => {
        return axiosInstance.delete(`/events/${eventId}/posts/${postId}`);
    },

    /**
     * Like a post
     */
    likePost: (eventId, postId) => {
        return axiosInstance.post(`/events/${eventId}/posts/${postId}/like`);
    },

    /**
     * Unlike a post
     */
    unlikePost: (eventId, postId) => {
        return axiosInstance.delete(`/events/${eventId}/posts/${postId}/like`);
    },

    /**
     * Get comments of a post
     */
    getComments: (eventId, postId) => {
        return axiosInstance.get(`/events/${eventId}/posts/${postId}/comments`);
    },

    /**
     * Create a comment on a post
     */
    createComment: (eventId, postId, content) => {
        return axiosInstance.post(`/events/${eventId}/posts/${postId}/comments`, { content });
    },

    /**
     * Update a comment
     */
    updateComment: (eventId, postId, commentId, content) => {
        return axiosInstance.put(`/events/${eventId}/posts/${postId}/comments/${commentId}`, { content });
    },

    /**
     * Delete a comment
     */
    deleteComment: (eventId, postId, commentId) => {
        return axiosInstance.delete(`/events/${eventId}/posts/${postId}/comments/${commentId}`);
    },
};
