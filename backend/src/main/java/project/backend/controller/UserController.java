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


@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

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
     * ADMIN: Get all users
     */
    @GetMapping("/admin/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    /**
     * ADMIN: Lock a user account
     */
    @PutMapping("/admin/users/{id}/lock")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> lockUser(@PathVariable Long id) {
        return ResponseEntity.ok(userService.lockUser(id));
    }

    /**
     * ADMIN: Unlock a user account
     */
    @PutMapping("/admin/users/{id}/unlock")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> unlockUser(@PathVariable Long id) {
        return ResponseEntity.ok(userService.unlockUser(id));
    }

    /**
     * ADMIN: Export users to CSV
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

}
