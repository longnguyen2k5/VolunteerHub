package project.backend.model.enums;

/**
 * Enum trạng thái đăng ký tham gia.
 */
public enum RegistrationStatus {
    PENDING,    // Chờ duyệt
    APPROVED,   // Đã duyệt
    REJECTED,   // Từ chối
    COMPLETED,  // Hoàn thành
    CANCELLED   // Đã hủy
}