package project.backend.dto.response;

import project.backend.model.Users;
import project.backend.model.enums.UserRole;

public record UserResponse(String fullName, String email, UserRole role, Boolean isLocked, String message) {
    public static UserResponse success (Users users, String message) {
        return new UserResponse(users.getFullName(), users.getEmail(), users.getRole(), users.getIsLocked(), null);
    }
    public static UserResponse error (String message){
        return new UserResponse(null, null, null, null, message);
    }
}
