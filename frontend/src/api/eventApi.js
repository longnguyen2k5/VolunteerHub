import axiosInstance from "./axiosConfig";

export const eventAPI = {
  /**
   * Lấy danh sách sự kiện (đã duyệt) với bộ lọc và phân trang
   * Query params: ?page=0&size=10&sort=startTime,desc&filter=...
   */
  getAll: (params) => {
    return axiosInstance.get("/events", { params });
  },

  /**
   * Lấy danh sách sự kiện công khai (endpoint thay thế)
   */
  getAllApproved: (params) => {
    return axiosInstance.get("/events/public", { params });
  },

  /**
   * Lấy chi tiết sự kiện theo ID
   */
  getById: (id) => {
    return axiosInstance.get(`/events/${id}`);
  },

  /**
   * Lấy chi tiết sự kiện công khai (không cần đăng nhập)
   */
  getPublicById: (id) => {
    return axiosInstance.get(`/events/public/${id}`);
  },

  /**
   * Lấy danh sách sự kiện sắp diễn ra
   */
  getUpcoming: (params) => {
    return axiosInstance.get("/events/upcoming", { params });
  },

  /**
   * EVENT_MANAGER: Tạo sự kiện mới
   * Sự kiện sẽ có trạng thái PENDING_APPROVAL
   */
  create: (eventData) => {
    return axiosInstance.post("/events", eventData);
  },

  /**
   * EVENT_MANAGER/ADMIN: Cập nhật thông tin sự kiện
   */
  update: (id, eventData) => {
    return axiosInstance.put(`/events/${id}`, eventData);
  },

  /**
   * EVENT_MANAGER/ADMIN: Xóa sự kiện
   */
  delete: (id) => {
    return axiosInstance.delete(`/events/${id}`);
  },

  /**
   * EVENT_MANAGER: Lấy danh sách sự kiện tôi tạo
   */
  getMyEvents: (params) => {
    return axiosInstance.get("/events/my-events", { params });
  },

  /**
   * EVENT_MANAGER: Lấy danh sách đăng ký của sự kiện
   */
  getEventRegistrations: (eventId, params) => {
    return axiosInstance.get(`/manager/events/${eventId}/registrations`, {
      params,
    });
  },

  /**
   * ADMIN: Lấy danh sách sự kiện chờ duyệt
   */
  getPendingEvents: (params) => {
    return axiosInstance.get("/events/pending", { params });
  },

  /**
   * ADMIN: Duyệt sự kiện
   */
  approveEvent: (id) => {
    return axiosInstance.put(`/events/${id}/approve`);
  },

  /**
   * ADMIN: Từ chối sự kiện
   */
  rejectEvent: (id) => {
    return axiosInstance.put(`/events/${id}/reject`);
  },

  /**
   * ADMIN: Xuất danh sách sự kiện ra CSV
   */
  exportEvents: async (status) => {
    const params = status ? { status } : {};
    const response = await axiosInstance.get("/events/export", {
      params,
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * ADMIN: Hoàn tác sự kiện về trạng thái chờ duyệt
   */
  revertEvent: (id) => {
    return axiosInstance.put(`/events/${id}/revert`);
  },
};
