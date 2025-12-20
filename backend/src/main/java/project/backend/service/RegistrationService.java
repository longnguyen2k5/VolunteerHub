package project.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project.backend.dto.response.RegistrationResponse;
import project.backend.exception.ResourceNotFoundException;
import project.backend.model.EventRegistrations;
import project.backend.model.Events;
import project.backend.model.Users;
import project.backend.model.enums.EventStatus;
import project.backend.model.enums.RegistrationStatus;
import project.backend.repository.EventRepository;
import project.backend.repository.RegistrationRepository;
import project.backend.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class RegistrationService {

    private final RegistrationRepository registrationRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    // ... existing methods ...

    @Transactional
    public RegistrationResponse registerForEvent(Long eventId, Long userId) {
        // ... implementation ...
        Events event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));
        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (event.getStatus() != EventStatus.APPROVED) {
            throw new IllegalArgumentException("Event is not approved");
        }
        
        // Check if already registered
        java.util.Optional<EventRegistrations> existingRegistrationOpt = registrationRepository.findByEventIdAndUserId(eventId, userId);

        if (existingRegistrationOpt.isPresent()) {
            EventRegistrations existingRegistration = existingRegistrationOpt.get();
            if (existingRegistration.getStatus() == RegistrationStatus.PENDING || 
                existingRegistration.getStatus() == RegistrationStatus.APPROVED ||
                existingRegistration.getStatus() == RegistrationStatus.COMPLETED) {
                throw new IllegalArgumentException("User already registered for this event");
            }
            // If CANCELLED or REJECTED -> Reactivate
             // Check capacity
            Long currentParticipants = registrationRepository.countApprovedByEventId(eventId);
            if (event.getMaxParticipants() != null && currentParticipants >= event.getMaxParticipants()) {
                throw new IllegalArgumentException("Event is full");
            }

            existingRegistration.setStatus(RegistrationStatus.PENDING);
            existingRegistration.setRegisteredAt(LocalDateTime.now());
            EventRegistrations saved = registrationRepository.save(existingRegistration);
            return RegistrationResponse.fromEntity(saved);
        }

        // Check capacity
        Long currentParticipants = registrationRepository.countApprovedByEventId(eventId);
        if (event.getMaxParticipants() != null && currentParticipants >= event.getMaxParticipants()) {
            throw new IllegalArgumentException("Event is full");
        }
        
        // Logic: Require approval? Let's assume PENDING by default
        EventRegistrations registration = new EventRegistrations();
        registration.setEvents(event);
        registration.setUser(user);
        registration.setStatus(RegistrationStatus.PENDING);
        registration.setRegisteredAt(LocalDateTime.now());

        EventRegistrations saved = registrationRepository.save(registration);
        
        // --- Notify Manager ---
        try {
            Long managerId = event.getManager().getId();
            // Don't notify if manager registers for their own event (unlikely but possible)
            if (!managerId.equals(userId)) {
                String title = "Đăng ký mới";
                String message = String.format("Thành viên %s đã đăng ký tham gia sự kiện '%s'.", user.getFullName(), event.getName());
                notificationService.sendPushNotification(managerId, title, message);
            }
        } catch (Exception e) {
            System.err.println("Failed to notify manager: " + e.getMessage());
        }

        return RegistrationResponse.fromEntity(saved);
    }
    
    @Transactional
    public void cancelRegistration(Long registrationId, Long userId) {
        EventRegistrations registration = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new ResourceNotFoundException("Registration not found"));
        
        if (!registration.getUser().getId().equals(userId)) {
             throw new IllegalArgumentException("Not authorized to cancel this registration");
        }
        
        if (registration.getStatus() == RegistrationStatus.COMPLETED) {
             throw new IllegalArgumentException("Cannot cancel completed registration");
        }

        registration.setStatus(RegistrationStatus.CANCELLED);
        registrationRepository.save(registration);
    }
    
    public List<RegistrationResponse> getMyRegistrations(Long userId) {
        return registrationRepository.findByUserId(userId).stream()
                .map(RegistrationResponse::fromEntity)
                .collect(Collectors.toList());
    }
    
    // For Event Manager
    public List<RegistrationResponse> getEventRegistrations(Long eventId, Long managerId) {
        Events event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));
                
        // Check if managerId is owner or Admin? 
        // Logic might be in Controller PreAuthorize, but extra check here is good.
        // For simplicity assuming Controller handles role check.
        
        return registrationRepository.findByEventId(eventId).stream()
                 .map(RegistrationResponse::fromEntity)
                 .collect(Collectors.toList());
    }

    public List<EventRegistrations> getEventRegistrationsEntity(Long eventId) {
        // Validation check if needed, or trust Controller
        return registrationRepository.findByEventIdWithDetails(eventId);
    }

    @Transactional
    public RegistrationResponse updateStatus(Long registrationId, RegistrationStatus status) {
        EventRegistrations registration = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new ResourceNotFoundException("Registration not found"));
        
        // If approving, check capacity again?
        if (status == RegistrationStatus.APPROVED) {
             Long current = registrationRepository.countApprovedByEventId(registration.getEvents().getId());
             if (registration.getEvents().getMaxParticipants() != null && current >= registration.getEvents().getMaxParticipants()) {
                 throw new IllegalArgumentException("Event is full");
             }
        }

        // Validate COMPLETION: Cannot mark as completed if event hasn't ended
        if (status == RegistrationStatus.COMPLETED) {
            LocalDateTime now = LocalDateTime.now();
            LocalDateTime endTime = registration.getEvents().getEndTime();
            log.info("Checking completion for event {}. EndTime: {}, Now: {}", registration.getEvents().getId(), endTime, now);
            
            if (endTime.isAfter(now)) {
                throw new project.backend.exception.BadRequestException("Sự kiện chưa kết thúc, không thể đánh dấu hoàn thành!");
            }
        }

        registration.setStatus(status);
        EventRegistrations saved = registrationRepository.save(registration);
        
        // Notify User
        try {
            String title = "Cập nhật trạng thái đăng ký";
            String message = String.format("Sự kiện '%s': Trạng thái mới là %s.", 
                    registration.getEvents().getName(), status.name());
                    
            if (status == RegistrationStatus.APPROVED) {
                title = "Đăng ký thành công!";
                message = String.format("Chúc mừng! Bạn đã được duyệt tham gia sự kiện '%s'.", registration.getEvents().getName());
            } else if (status == RegistrationStatus.REJECTED) {
                 title = "Đăng ký bị từ chối";
                 message = String.format("Rất tiếc, đăng ký tham gia sự kiện '%s' của bạn đã bị từ chối.", registration.getEvents().getName());
            } else if (status == RegistrationStatus.COMPLETED) {
                 title = "Hoàn thành sự kiện";
                 message = String.format("Bạn đã hoàn thành tham gia sự kiện '%s'.", registration.getEvents().getName());
            }

            notificationService.sendPushNotification(registration.getUser().getId(), title, message);
        } catch (Exception e) {
            // Log but don't fail the transaction
            log.error("Failed to send push notification: {}", e.getMessage());
        }

        return RegistrationResponse.fromEntity(saved);
    }
}
