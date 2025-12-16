import axiosInstance from "./axiosConfig";

export const eventAPI = {
  /**
   * Get all approved events with optional filters and pagination
   * Query params: ?page=0&size=10&sort=startTime,desc&filter=...
   */
  getAll: (params) => {
    return axiosInstance.get("/events", { params });
  },

  /**
   * Get all approved events (legacy/alternative endpoint)
   */
  getAllApproved: (params) => {
    return axiosInstance.get("/events/public", { params });
  },

  /**
   * Get event details by ID
   */
  getById: (id) => {
    return axiosInstance.get(`/events/${id}`);
  },

  /**
   * Get public event details by ID (no auth required)
   */
  getPublicById: (id) => {
    return axiosInstance.get(`/events/public/${id}`);
  },

  /**
   * Get upcoming events
   */
  getUpcoming: (params) => {
    return axiosInstance.get("/events/upcoming", { params });
  },

  /**
   * EVENT_MANAGER: Create a new event
   * Event will have status PENDING_APPROVAL
   */
  create: (eventData) => {
    return axiosInstance.post("/events", eventData);
  },

  /**
   * EVENT_MANAGER/ADMIN: Update event information
   */
  update: (id, eventData) => {
    return axiosInstance.put(`/events/${id}`, eventData);
  },

  /**
   * EVENT_MANAGER/ADMIN: Delete an event
   */
  delete: (id) => {
    return axiosInstance.delete(`/events/${id}`);
  },

  /**
   * EVENT_MANAGER: Get my created events
   */
  getMyEvents: (params) => {
    return axiosInstance.get("/events/my-events", { params });
  },

  /**
   * EVENT_MANAGER: Get registrations for a specific event
   */
  getEventRegistrations: (eventId, params) => {
    return axiosInstance.get(`/manager/events/${eventId}/registrations`, {
      params,
    });
  },

  /**
   * ADMIN: Get all pending events
   */
  getPendingEvents: (params) => {
    return axiosInstance.get("/events/pending", { params });
  },

  /**
   * ADMIN: Approve an event
   */
  approveEvent: (id) => {
    return axiosInstance.put(`/events/${id}/approve`);
  },

  /**
   * ADMIN: Reject an event
   */
  rejectEvent: (id) => {
    return axiosInstance.put(`/events/${id}/reject`);
  },
};
