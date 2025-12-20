package project.backend.model.enums;

/**
 * Enum trạng thái sự kiện.
 */
public enum EventStatus {
    PENDING_APPROVAL,  // Chờ duyệt
    APPROVED,          // Đã duyệt
    REJECTED           // Từ chối
}