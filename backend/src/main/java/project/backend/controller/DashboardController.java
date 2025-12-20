package project.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import project.backend.dto.response.DashboardResponse;
import project.backend.service.DashboardService;

/**
 * Controller xử lý các yêu cầu liên quan đến Dashboard.
 */
@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    /**
     * Lấy dữ liệu tổng quan cho Dashboard của người dùng hiện tại.
     */
    @GetMapping
    public ResponseEntity<DashboardResponse> getDashboard() {
        Long userId = getUserIdFromAuth();
        return ResponseEntity.ok(dashboardService.getDashboardData(userId));
    }

    /**
     * Utility method để lấy User ID từ JWT token.
     */
    private Long getUserIdFromAuth() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        Object principal = authentication.getPrincipal();
        if (principal instanceof Jwt) {
            Jwt jwt = (Jwt) principal;
            return (Long) jwt.getClaims().get("user_id");
        }
        return null;
    }
}
