package project.backend.service;

import lombok.RequiredArgsConstructor;
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
public class RegistrationService {

    private final RegistrationRepository registrationRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    @Transactional
    public RegistrationResponse registerForEvent(Long eventId, Long userId) {
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
             
             // Update current participants count in Events entity if you are caching it there
             // Events event = registration.getEvents();
             // event.setCurrentParticipants(current.intValue() + 1);
             // eventRepository.save(event);
        }

        registration.setStatus(status);
        return RegistrationResponse.fromEntity(registrationRepository.save(registration));
    }
}
