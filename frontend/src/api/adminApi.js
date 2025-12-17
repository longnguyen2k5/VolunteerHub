import axiosInstance from "./axiosConfig";

/**
 * ADMIN: Get all users
 */
export const getAllUsers = async () => {
  const response = await axiosInstance.get("/admin/users");
  return response.data;
};

/**
 * ADMIN: Lock a user account
 */
export const lockUser = async (userId) => {
  const response = await axiosInstance.put(`/admin/users/${userId}/lock`);
  return response.data;
};

/**
 * ADMIN: Unlock a user account
 */
export const unlockUser = async (userId) => {
  const response = await axiosInstance.put(`/admin/users/${userId}/unlock`);
  return response.data;
};

/**
 * ADMIN: Export users to CSV
 */
export const exportUsers = async () => {
  const response = await axiosInstance.get("/admin/users/export", {
    responseType: 'blob',
  });
  return response.data;
};
