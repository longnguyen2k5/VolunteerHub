package project.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;
import project.backend.dto.response.UserResponse;
import project.backend.service.UserService;

import java.util.List;

/**
 * Controller xử lý thông tin người dùng và quản trị người dùng.
 */
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    /**
     * Lấy thông tin người dùng hiện tại (dựa trên token).
     */
    @GetMapping("/users/info")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<UserResponse> getUserInfo(JwtAuthenticationToken jwtAuthenticationToken) {
        String email = jwtAuthenticationToken.getToken().getSubject();
        try {
            return ResponseEntity.status(HttpStatus.OK).body(userService.getUserInfo(email));
        }catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(UserResponse.error(e.getMessage()));
        }
    }

    /**
     * Cập nhật thông tin cá nhân.
     */
    @PutMapping("/users/profile")
    public ResponseEntity<UserResponse> updateProfile(JwtAuthenticationToken jwtAuthenticationToken, @RequestBody project.backend.dto.request.RegisterRequest request) {
        String email = jwtAuthenticationToken.getToken().getSubject();
        return ResponseEntity.ok(userService.updateProfile(email, request.getFullName()));
    }

    /**
     * Admin: Lấy danh sách tất cả người dùng.
     */
    @GetMapping("/admin/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    /**
     * Admin: Khóa tài khoản người dùng.
     */
    @PutMapping("/admin/users/{id}/lock")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> lockUser(@PathVariable Long id) {
        return ResponseEntity.ok(userService.lockUser(id));
    }

    /**
     * Admin: Mở khóa tài khoản người dùng.
     */
    @PutMapping("/admin/users/{id}/unlock")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> unlockUser(@PathVariable Long id) {
        return ResponseEntity.ok(userService.unlockUser(id));
    }

    /**
     * Admin: Xuất danh sách người dùng ra CSV.
     */
    @GetMapping("/admin/users/export")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<byte[]> exportUsersToCsv() {
        byte[] csvData = project.backend.utils.CsvExportUtil.exportUsersToCsv(userService.getAllUsersEntity());
        return ResponseEntity.ok()
                .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=users.csv")
                .contentType(org.springframework.http.MediaType.parseMediaType("text/csv"))
                .body(csvData);
    }

    /**
     * Admin: Tạo tài khoản Admin mới.
     */
    @PostMapping("/admin/users/create-admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<project.backend.dto.response.MessageResponse> createAdmin(@RequestBody @jakarta.validation.Valid project.backend.dto.request.RegisterRequest request) {
        userService.createAdmin(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new project.backend.dto.response.MessageResponse("Admin created successfully"));
    }
}
