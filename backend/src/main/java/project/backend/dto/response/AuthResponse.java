package project.backend.dto.response;

import project.backend.model.enums.UserRole;

public record AuthResponse(String fullName, String message, String email, UserRole role, String sessionId) {
    public static AuthResponse registerSuccess (String email, String fullName, UserRole role, String sessionId) {
        return new AuthResponse(fullName,"Registered Successfully",email,role,sessionId);
    }
    public static AuthResponse error (String message) {
        return new AuthResponse(null,message,null,null,null);
    }
}
