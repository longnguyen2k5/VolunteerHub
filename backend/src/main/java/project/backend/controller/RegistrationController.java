package project.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import project.backend.dto.response.RegistrationResponse;
import project.backend.model.enums.RegistrationStatus;
import project.backend.service.RegistrationService;

import java.util.List;

@RestController
@RequestMapping("/api/registrations")
@RequiredArgsConstructor
public class RegistrationController {

    private final RegistrationService registrationService;

    @PostMapping("/events/{eventId}")
    @PreAuthorize("hasRole('VOLUNTEER')")
    public ResponseEntity<RegistrationResponse> registerForEvent(
            @PathVariable Long eventId,
            Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(registrationService.registerForEvent(eventId, userId));
    }

    @DeleteMapping("/{id}/cancel")
    @PreAuthorize("hasRole('VOLUNTEER')")
    public ResponseEntity<Void> cancelRegistration(
            @PathVariable Long id,
            Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        registrationService.cancelRegistration(id, userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/my-registrations")
    @PreAuthorize("hasRole('VOLUNTEER')")
    public ResponseEntity<List<RegistrationResponse>> getMyRegistrations(Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        return ResponseEntity.ok(registrationService.getMyRegistrations(userId));
    }

    // Manager endpoints
    @GetMapping("/events/{eventId}")
    @PreAuthorize("hasAnyRole('EVENT_MANAGER', 'ADMIN')")
    public ResponseEntity<List<RegistrationResponse>> getEventRegistrations(
            @PathVariable Long eventId,
            Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication); // Manager ID
        return ResponseEntity.ok(registrationService.getEventRegistrations(eventId, userId));
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('EVENT_MANAGER', 'ADMIN')")
    public ResponseEntity<RegistrationResponse> approveRegistration(@PathVariable Long id) {
        return ResponseEntity.ok(registrationService.updateStatus(id, RegistrationStatus.APPROVED));
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('EVENT_MANAGER', 'ADMIN')")
    public ResponseEntity<RegistrationResponse> rejectRegistration(@PathVariable Long id) {
        return ResponseEntity.ok(registrationService.updateStatus(id, RegistrationStatus.REJECTED));
    }

    @PutMapping("/{id}/complete")
    @PreAuthorize("hasAnyRole('EVENT_MANAGER', 'ADMIN')")
    public ResponseEntity<RegistrationResponse> completeRegistration(@PathVariable Long id) {
        return ResponseEntity.ok(registrationService.updateStatus(id, RegistrationStatus.COMPLETED));
    }

    private Long getUserIdFromAuth(Authentication authentication) {
        if (authentication.getPrincipal() instanceof Jwt jwt) {
            Long userId = jwt.getClaim("user_id");
            if (userId == null) {
                throw new RuntimeException("user_id claim not found");
            }
            return userId;
        }
        throw new RuntimeException("Invalid authentication");
    }
}
