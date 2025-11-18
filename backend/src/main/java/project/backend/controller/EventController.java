
package project.backend.controller;

import project.backend.dto.request.EventRequest;
import project.backend.dto.response.EventResponse;
import project.backend.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @GetMapping("/public")
    public ResponseEntity<List<EventResponse>> getAllApprovedEvents() {
        return ResponseEntity.ok(eventService.getAllApprovedEvents());
    }

    @GetMapping("/public/{id}")
    public ResponseEntity<EventResponse> getEventById(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.getEventById(id));
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<EventResponse>> getUpcomingEvents() {
        return ResponseEntity.ok(eventService.getUpcomingEvents());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('EVENT_MANAGER', 'ADMIN')")
    public ResponseEntity<EventResponse> createEvent(
            @Valid @RequestBody EventRequest request,
            Authentication authentication) {
        Long managerId = getUserIdFromAuth(authentication);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(eventService.createEvent(request, managerId));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('EVENT_MANAGER', 'ADMIN')")
    public ResponseEntity<EventResponse> updateEvent(
            @PathVariable Long id,
            @Valid @RequestBody EventRequest request,
            Authentication authentication) {
        Long managerId = getUserIdFromAuth(authentication);
        return ResponseEntity.ok(eventService.updateEvent(id, request, managerId));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('EVENT_MANAGER', 'ADMIN')")
    public ResponseEntity<Void> deleteEvent(
            @PathVariable Long id,
            Authentication authentication) {
        Long managerId = getUserIdFromAuth(authentication);
        eventService.deleteEvent(id, managerId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/my-events")
    @PreAuthorize("hasAnyRole('EVENT_MANAGER', 'ADMIN')")
    public ResponseEntity<List<EventResponse>> getMyEvents(Authentication authentication) {
        Long managerId = getUserIdFromAuth(authentication);
        return ResponseEntity.ok(eventService.getEventsByManager(managerId));
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EventResponse> approveEvent(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.approveEvent(id));
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EventResponse> rejectEvent(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.rejectEvent(id));
    }

    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<EventResponse>> getPendingEvents() {
        return ResponseEntity.ok(eventService.getPendingEvents());
    }

    /**
     * Helper: Extract user ID từ JWT token
     */
    private Long getUserIdFromAuth(Authentication authentication) {
        if (authentication.getPrincipal() instanceof Jwt jwt) {
            Long userId = jwt.getClaim("user_id");
            if (userId == null) {
                throw new RuntimeException("user_id claim not found in JWT token. Please logout and login again.");
            }
            return userId;
        }
        throw new RuntimeException("Invalid authentication");
    }
}