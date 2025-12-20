package project.backend.dto.response;

import project.backend.model.Users;
import project.backend.model.enums.UserRole;

import java.time.LocalDateTime;

public record UserResponse(Long id, String fullName, String email, UserRole role, Boolean isLocked, LocalDateTime createdAt, String message) {
    public static UserResponse success (Users users, String message) {
        return new UserResponse(users.getId(), users.getFullName(), users.getEmail(), users.getRole(), users.getIsLocked(), users.getCreatedAt(), null);
    }
    public static UserResponse error (String message){
        return new UserResponse(null, null, null, null, null, null, message);
    }
}
