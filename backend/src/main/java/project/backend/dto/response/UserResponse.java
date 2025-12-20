package project.backend.dto.response;

import project.backend.model.Users;
import project.backend.model.enums.UserRole;

import java.time.LocalDateTime;

/**
 * DTO phản hồi thông tin người dùng.
 */
public record UserResponse(Long id, String fullName, String email, UserRole role, Boolean isLocked, LocalDateTime createdAt, String message) {
    
    /**
     * Helper tạo phản hồi thành công từ entity Users.
     */
    public static UserResponse success (Users users, String message) {
        return new UserResponse(users.getId(), users.getFullName(), users.getEmail(), users.getRole(), users.getIsLocked(), users.getCreatedAt(), null);
    }
    
    /**
     * Helper tạo phản hồi lỗi.
     */
    public static UserResponse error (String message){
        return new UserResponse(null, null, null, null, null, null, message);
    }
}
