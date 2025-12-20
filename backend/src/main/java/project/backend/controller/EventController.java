
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

/**
 * Controller quản lý các hoạt động tình nguyện.
 */
@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    /**
     * Lấy danh sách các sự kiện đã được duyệt (public).
     */
    @GetMapping("/public")
    public ResponseEntity<List<EventResponse>> getAllApprovedEvents() {
        return ResponseEntity.ok(eventService.getAllApprovedEvents());
    }

    /**
     * Lấy chi tiết một sự kiện công khai theo ID.
     */
    @GetMapping("/public/{id}")
    public ResponseEntity<EventResponse> getPublicEventById(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.getEventById(id));
    }

    /**
     * Lấy chi tiết một sự kiện theo ID (yêu cầu đăng nhập).
     */
    @GetMapping("/{id}")
    public ResponseEntity<EventResponse> getEventById(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.getEventById(id));
    }

    /**
     * Lấy danh sách các sự kiện sắp diễn ra.
     */
    @GetMapping("/upcoming")
    public ResponseEntity<List<EventResponse>> getUpcomingEvents() {
        return ResponseEntity.ok(eventService.getUpcomingEvents());
    }

    /**
     * Tạo sự kiện mới (Manager/Admin).
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('EVENT_MANAGER', 'ADMIN')")
    public ResponseEntity<EventResponse> createEvent(
            @Valid @RequestBody EventRequest request,
            Authentication authentication) {
        Long managerId = getUserIdFromAuth(authentication);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(eventService.createEvent(request, managerId));
    }

    /**
     * Cập nhật thông tin sự kiện.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('EVENT_MANAGER', 'ADMIN')")
    public ResponseEntity<EventResponse> updateEvent(
            @PathVariable Long id,
            @Valid @RequestBody EventRequest request,
            Authentication authentication) {
        Long managerId = getUserIdFromAuth(authentication);
        return ResponseEntity.ok(eventService.updateEvent(id, request, managerId));
    }

    /**
     * Xóa sự kiện.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('EVENT_MANAGER', 'ADMIN')")
    public ResponseEntity<Void> deleteEvent(
            @PathVariable Long id,
            Authentication authentication) {
        Long managerId = getUserIdFromAuth(authentication);
        eventService.deleteEvent(id, managerId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Lấy danh sách sự kiện do người dùng hiện tại quản lý.
     */
    @GetMapping("/my-events")
    @PreAuthorize("hasAnyRole('EVENT_MANAGER', 'ADMIN')")
    public ResponseEntity<List<EventResponse>> getMyEvents(Authentication authentication) {
        Long managerId = getUserIdFromAuth(authentication);
        return ResponseEntity.ok(eventService.getEventsByManager(managerId));
    }

    /**
     * Duyệt sự kiện (Admin).
     */
    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EventResponse> approveEvent(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.approveEvent(id));
    }

    /**
     * Từ chối sự kiện (Admin).
     */
    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EventResponse> rejectEvent(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.rejectEvent(id));
    }

    /**
     * Hoàn tác trạng thái sự kiện về chờ duyệt (Admin).
     */
    @PutMapping("/{id}/revert")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EventResponse> revertEvent(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.revertEvent(id));
    }

    /**
     * Lấy danh sách sự kiện chờ duyệt hoặc theo trạng thái (Admin).
     */
    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<EventResponse>> getAdminEvents(@RequestParam(required = false) project.backend.model.enums.EventStatus status) {
        if (status == null) {
            return ResponseEntity.ok(eventService.getPendingEvents());
        }
        return ResponseEntity.ok(eventService.getEventsByStatus(status));
    }

    /**
     * Xuất danh sách sự kiện ra file CSV (Admin).
     */
    @GetMapping("/export")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<byte[]> exportEventsToCsv(@RequestParam(required = false) project.backend.model.enums.EventStatus status) {
        List<project.backend.model.Events> events;
        if (status == null) {
            events = eventService.getAllEventsEntity();
        } else {
            events = eventService.getEventsByStatusEntity(status);
        }
        
        byte[] csvData = project.backend.utils.CsvExportUtil.exportEventsToCsv(events);
        String filename = status != null ? "events_" + status.name().toLowerCase() + ".csv" : "events_all.csv";
        
        return ResponseEntity.ok()
                .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                .contentType(org.springframework.http.MediaType.parseMediaType("text/csv"))
                .body(csvData);
    }

    /**
     * Utility method: Lấy User ID từ JWT token.
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