import axiosClient from './axiosConfig';



export const getAllUsers = () => {
  return axiosClient.get('/admin/users');
};

export const lockUser = (userId) => {
  return axiosClient.put(`/admin/users/${userId}/lock`);
};

export const unlockUser = (userId) => {
  return axiosClient.put(`/admin/users/${userId}/unlock`);
};

export const exportUsers = () => {
  return axiosClient.get('/admin/users/export', {
    responseType: 'blob'
  });
};

export const createAdmin = (data) => {
  return axiosClient.post('/admin/users/create-admin', data);
};

const adminApi = {
  getAllUsers,
  lockUser,
  unlockUser,
  exportUsers,
  createAdmin
};

export default adminApi;
