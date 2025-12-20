import axiosClient from './axiosConfig';

export const uploadApi = {
    // Upload ảnh (cho bài viết, avatar, ...)
    uploadImage: (file) => {
        const formData = new FormData();
        formData.append('file', file);

        return axiosClient.post('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
};
