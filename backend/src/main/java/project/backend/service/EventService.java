package project.backend.service;

import project.backend.dto.request.EventRequest;
import project.backend.dto.response.EventResponse;
import project.backend.exception.BadRequestException;
import project.backend.exception.ResourceNotFoundException;
import project.backend.exception.UnauthorizedException;
import project.backend.model.Events;
import project.backend.model.Users;
import project.backend.model.enums.EventStatus;
import project.backend.repository.EventRepository;
import project.backend.repository.RegistrationRepository;
import project.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service xử lý logic nghiệp vụ cho sự kiện.
 */
@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final RegistrationRepository registrationRepository;
    private final NotificationService notificationService;

    /**
     * Tạo sự kiện mới.
     */
    @Transactional
    public EventResponse createEvent(EventRequest request, Long managerId) {
        if (request.getEndTime().isBefore(request.getStartTime())) {
            throw new BadRequestException("Thời gian kết thúc phải sau thời gian bắt đầu");
        }
        
        // Kiểm tra giới hạn MySQL TIMESTAMP (2038-01-19)
        LocalDateTime MAX_TIMESTAMP = LocalDateTime.of(2038, 1, 19, 0, 0, 0);
        if (request.getStartTime().isAfter(MAX_TIMESTAMP) || request.getEndTime().isAfter(MAX_TIMESTAMP)) {
            throw new BadRequestException("Thời gian sự kiện không được vượt quá giới hạn MySQL TIMESTAMP (2038-01-19)");
        }

        Users manager = userRepository.findById(managerId)
                .orElseThrow(() -> new ResourceNotFoundException("Manager not found"));

        Events event = new Events();
        event.setName(request.getName());
        event.setDescription(request.getDescription());
        event.setLocation(request.getLocation());
        event.setImageUrl(request.getImageUrl());
        event.setStartTime(request.getStartTime());
        event.setEndTime(request.getEndTime());
        event.setMaxParticipants(request.getMaxParticipants());
        if (request.getCategory() != null) {
            try {
                event.setCategory(project.backend.model.enums.EventCategory.valueOf(request.getCategory()));
            } catch (IllegalArgumentException e) {
                // Bỏ qua danh mục không hợp lệ
            }
        }
        event.setStatus(EventStatus.PENDING_APPROVAL);
        event.setManager(manager);

        Events savedEvent = eventRepository.save(event);
        
        // --- Gửi thông báo cho Admin ---
        try {
            List<Users> admins = userRepository.findByRole(project.backend.model.enums.UserRole.ADMIN);
            String title = "Sự kiện mới chờ duyệt";
            String message = String.format("Quản lý %s vừa tạo sự kiện mới: '%s'.", manager.getFullName(), savedEvent.getName());
            
            for (Users admin : admins) {
                notificationService.sendPushNotification(admin.getId(), title, message);
            }
        } catch (Exception e) {
            System.err.println("Failed to notify admins: " + e.getMessage());
        }

        return mapToResponse(savedEvent);
    }

    /**
     * Cập nhật thông tin sự kiện.
     */
    @Transactional
    public EventResponse updateEvent(Long eventId, EventRequest request, Long managerId) {
        Events event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        if (!event.getManager().getId().equals(managerId)) {
            throw new UnauthorizedException("Bạn không có quyền cập nhật sự kiện này");
        }

        if (request.getEndTime().isBefore(request.getStartTime())) {
            throw new BadRequestException("Thời gian kết thúc phải sau thời gian bắt đầu");
        }

        event.setName(request.getName());
        event.setDescription(request.getDescription());
        event.setLocation(request.getLocation());
        event.setImageUrl(request.getImageUrl());
        event.setStartTime(request.getStartTime());
        event.setEndTime(request.getEndTime());
        event.setMaxParticipants(request.getMaxParticipants());
        if (request.getCategory() != null) {
             try {
                 event.setCategory(project.backend.model.enums.EventCategory.valueOf(request.getCategory()));
             } catch (IllegalArgumentException e) {
             }
        }

        Events updatedEvent = eventRepository.save(event);
        return mapToResponse(updatedEvent);
    }

    /**
     * Xóa sự kiện.
     */
    @Transactional
    public void deleteEvent(Long eventId, Long managerId) {
        Events event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        if (!event.getManager().getId().equals(managerId)) {
            throw new UnauthorizedException("Bạn không có quyền xóa sự kiện này");
        }

        eventRepository.delete(event);
    }

    @Transactional(readOnly = true)
    public EventResponse getEventById(Long eventId) {
        Events event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));
        return mapToResponse(event);
    }

    @Transactional(readOnly = true)
    public List<EventResponse> getAllApprovedEvents() {
        return eventRepository.findByStatus(EventStatus.APPROVED)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<EventResponse> getEventsByManager(Long managerId) {
        return eventRepository.findByManagerId(managerId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<EventResponse> getUpcomingEvents() {
        return eventRepository.findUpcomingApprovedEvents(LocalDateTime.now())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public EventResponse approveEvent(Long eventId) {
        Events event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));
        event.setStatus(EventStatus.APPROVED);
        return mapToResponse(eventRepository.save(event));
    }

    @Transactional
    public EventResponse rejectEvent(Long eventId) {
        Events event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));
        event.setStatus(EventStatus.REJECTED);
        return mapToResponse(eventRepository.save(event));
    }

    @Transactional
    public EventResponse revertEvent(Long eventId) {
        Events event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));
        event.setStatus(EventStatus.PENDING_APPROVAL);
        return mapToResponse(eventRepository.save(event));
    }

    @Transactional(readOnly = true)
    public List<EventResponse> getPendingEvents() {
        return eventRepository.findByStatus(EventStatus.PENDING_APPROVAL)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<EventResponse> getEventsByStatus(EventStatus status) {
        return eventRepository.findByStatus(status)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<Events> getAllEventsEntity() {
        return eventRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Events> getEventsByStatusEntity(EventStatus status) {
        return eventRepository.findByStatus(status);
    }

    public EventResponse mapToResponse(Events event) {
        EventResponse response = new EventResponse();
        response.setId(event.getId());
        response.setName(event.getName());
        response.setDescription(event.getDescription());
        response.setLocation(event.getLocation());
        response.setImageUrl(event.getImageUrl());
        response.setStartTime(event.getStartTime());
        response.setEndTime(event.getEndTime());
        response.setMaxParticipants(event.getMaxParticipants());
        response.setCategory(event.getCategory());
        response.setStatus(event.getStatus());
        response.setManagerId(event.getManager().getId());
        response.setManagerName(event.getManager().getFullName());
        response.setCreatedAt(event.getCreatedAt());

        Long participants = registrationRepository.countApprovedByEventId(event.getId());
        response.setCurrentParticipants(participants.intValue());

        return response;
    }
}