import axiosClient from './axiosConfig';

export const uploadApi = {
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
