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

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final RegistrationRepository registrationRepository;

    @Transactional
    public EventResponse createEvent(EventRequest request, Long managerId) {
        if (request.getEndTime().isBefore(request.getStartTime())) {
            throw new BadRequestException("End time must be after start time");
        }

        Users manager = userRepository.findById(managerId)
                .orElseThrow(() -> new ResourceNotFoundException("Manager not found"));

        Events event = new Events();
        event.setName(request.getName());
        event.setDescription(request.getDescription());
        event.setLocation(request.getLocation());
        event.setStartTime(request.getStartTime());
        event.setStartTime(request.getStartTime());
        event.setEndTime(request.getEndTime());
        event.setMaxParticipants(request.getMaxParticipants());
        if (request.getCategory() != null) {
            try {
                event.setCategory(project.backend.model.enums.EventCategory.valueOf(request.getCategory()));
            } catch (IllegalArgumentException e) {
                // Ignore invalid category or set default?
            }
        }
        event.setStatus(EventStatus.PENDING_APPROVAL);
        event.setManager(manager);

        Events savedEvent = eventRepository.save(event);
        return mapToResponse(savedEvent);
    }

    @Transactional
    public EventResponse updateEvent(Long eventId, EventRequest request, Long managerId) {
        Events event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        if (!event.getManager().getId().equals(managerId)) {
            throw new UnauthorizedException("Unauthorized to update this event");
        }

        if (request.getEndTime().isBefore(request.getStartTime())) {
            throw new BadRequestException("End time must be after start time");
        }

        event.setName(request.getName());
        event.setDescription(request.getDescription());
        event.setLocation(request.getLocation());
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

    @Transactional
    public void deleteEvent(Long eventId, Long managerId) {
        Events event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        if (!event.getManager().getId().equals(managerId)) {
            throw new UnauthorizedException("Unauthorized to delete this event");
        }

        eventRepository.delete(event);
    }

    public EventResponse getEventById(Long eventId) {
        Events event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));
        return mapToResponse(event);
    }

    public List<EventResponse> getAllApprovedEvents() {
        return eventRepository.findByStatus(EventStatus.APPROVED)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<EventResponse> getEventsByManager(Long managerId) {
        return eventRepository.findByManagerId(managerId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

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

    public List<EventResponse> getPendingEvents() {
        return eventRepository.findByStatus(EventStatus.PENDING_APPROVAL)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public EventResponse mapToResponse(Events event) {
        EventResponse response = new EventResponse();
        response.setId(event.getId());
        response.setName(event.getName());
        response.setDescription(event.getDescription());
        response.setLocation(event.getLocation());
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