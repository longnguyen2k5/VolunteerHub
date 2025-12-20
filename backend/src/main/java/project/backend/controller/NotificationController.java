package project.backend.controller;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import project.backend.service.NotificationService;

/**
 * Controller xử lý Web Push Notifications.
 */
@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @Value("${vapid.public.key}")
    private String publicKey;

    /**
     * Lấy VAPID public key cho frontend.
     */
    @GetMapping("/vapid-key")
    public ResponseEntity<String> getPublicKey() {
        return ResponseEntity.ok(publicKey);
    }

    /**
     * Đăng ký nhận thông báo (Subscribe).
     */
    @PostMapping("/subscribe")
    public ResponseEntity<Void> subscribe(@RequestBody SubscriptionRequest request, Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        notificationService.subscribe(userId, request.getEndpoint(), request.getKeys().getP256dh(), request.getKeys().getAuth());
        return ResponseEntity.ok().build();
    }

    /**
     * Hủy đăng ký nhận thông báo (Unsubscribe).
     */
    @PostMapping("/unsubscribe")
    public ResponseEntity<Void> unsubscribe(@RequestBody SubscriptionRequest request) {
        notificationService.unsubscribe(request.getEndpoint());
        return ResponseEntity.ok().build();
    }

    private Long getUserIdFromAuth(Authentication authentication) {
        if (authentication.getPrincipal() instanceof Jwt jwt) {
            Long userId = jwt.getClaim("user_id");
            if (userId == null) throw new RuntimeException("user_id not found");
            return userId;
        }
        throw new RuntimeException("Invalid Auth");
    }

    @Data
    public static class SubscriptionRequest {
        private String endpoint;
        private Keys keys;

        @Data
        public static class Keys {
            private String p256dh;
            private String auth;
        }
    }
}
