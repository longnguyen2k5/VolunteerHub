package project.backend.dto.response;

import project.backend.model.enums.UserRole;

/**
 * DTO phản hồi xác thực (Đăng ký).
 */
public record AuthResponse(String fullName, String message, String email, UserRole role, String sessionId) {
    
    /**
     * Helper tạo phản hồi đăng ký thành công.
     */
    public static AuthResponse registerSuccess (String email, String fullName, UserRole role, String sessionId) {
        return new AuthResponse(fullName,"Registered Successfully",email,role,sessionId);
    }
    
    /**
     * Helper tạo phản hồi lỗi.
     */
    public static AuthResponse error (String message) {
        return new AuthResponse(null,message,null,null,null);
    }
}
