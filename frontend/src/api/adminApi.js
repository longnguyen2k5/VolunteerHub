import axiosClient from './axiosConfig';

// --- Quản lý người dùng (Admin) ---

// Lấy danh sách tất cả người dùng
export const getAllUsers = () => {
  return axiosClient.get('/admin/users');
};

// Khóa tài khoản người dùng
export const lockUser = (userId) => {
  return axiosClient.put(`/admin/users/${userId}/lock`);
};

// Mở khóa tài khoản người dùng
export const unlockUser = (userId) => {
  return axiosClient.put(`/admin/users/${userId}/unlock`);
};

// Xuất danh sách người dùng ra file CSV
export const exportUsers = () => {
  return axiosClient.get('/admin/users/export', {
    responseType: 'blob'
  });
};

// Tạo tài khoản Admin mới
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
