package project.backend.controller;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import project.backend.service.NotificationService;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @Value("${vapid.public.key}")
    private String publicKey;

    @GetMapping("/vapid-key")
    public ResponseEntity<String> getPublicKey() {
        return ResponseEntity.ok(publicKey);
    }

    @PostMapping("/subscribe")
    public ResponseEntity<Void> subscribe(@RequestBody SubscriptionRequest request, Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        notificationService.subscribe(userId, request.getEndpoint(), request.getKeys().getP256dh(), request.getKeys().getAuth());
        return ResponseEntity.ok().build();
    }

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

        public String getEndpoint() {
            return endpoint;
        }

        public void setEndpoint(String endpoint) {
            this.endpoint = endpoint;
        }

        public Keys getKeys() {
            return keys;
        }

        public void setKeys(Keys keys) {
            this.keys = keys;
        }

        public static class Keys {
            private String p256dh;
            private String auth;

            public String getP256dh() {
                return p256dh;
            }

            public void setP256dh(String p256dh) {
                this.p256dh = p256dh;
            }

            public String getAuth() {
                return auth;
            }

            public void setAuth(String auth) {
                this.auth = auth;
            }
        }
    }
}
