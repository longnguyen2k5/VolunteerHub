package project.backend.dto.request;

import project.backend.model.enums.UserRole;
import jakarta.validation.constraints.*;
import lombok.Data;

/**
 * DTO yêu cầu đăng ký tài khoản.
 */
@Data
public class RegisterRequest {

    @NotBlank(message = "Full name is required")
    @Size(min = 2, max = 255)
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @NotNull(message = "Role is required")
    private UserRole role;
}