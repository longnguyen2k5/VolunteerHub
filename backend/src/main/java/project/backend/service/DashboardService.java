package project.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import project.backend.dto.response.DashboardResponse;
import project.backend.dto.response.EventResponse;
import project.backend.model.Users;
import project.backend.model.enums.EventStatus;
import project.backend.model.enums.UserRole;
import project.backend.repository.EventRepository;
import project.backend.repository.RegistrationRepository;
import project.backend.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.transaction.annotation.Transactional;

/**
 * Service xử lý dữ liệu Dashboard.
 */
@Service
@RequiredArgsConstructor
public class DashboardService {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final RegistrationRepository registrationRepository;
    private final EventService eventService;

    /**
     * Lấy dữ liệu thống kê cho Dashboard dựa trên vai trò người dùng.
     */
    @Transactional(readOnly = true)
    public DashboardResponse getDashboardData(Long userId) {
        Users user = userRepository.findById(userId).orElseThrow();
        DashboardResponse.DashboardResponseBuilder builder = DashboardResponse.builder();

        // 1. Thống kê theo vai trò
        if (user.getRole() == UserRole.ADMIN) {
            builder.totalEvents(eventRepository.count());
            builder.totalUsers(userRepository.count());
            builder.totalRegistrations(registrationRepository.count());
        } else if (user.getRole() == UserRole.EVENT_MANAGER) {
             builder.totalEvents(eventRepository.findByManagerId(userId).size());
             builder.totalRegistrations(registrationRepository.countByEventManagerId(userId));
        }

        // 2. Các danh sách sự kiện khám phá (chung cho mọi vai trò)
        
        // Sự kiện mới nhất
        List<EventResponse> newEvents = eventRepository.findTop5ByStatusOrderByCreatedAtDesc(EventStatus.APPROVED)
                .stream().map(eventService::mapToResponse).collect(Collectors.toList());
        builder.newEvents(newEvents);

        // Sự kiện sắp diễn ra
        List<EventResponse> upcomingEvents = eventRepository.findTop5ByStatusAndStartTimeAfterOrderByStartTimeAsc(EventStatus.APPROVED, LocalDateTime.now())
                .stream().map(eventService::mapToResponse).collect(Collectors.toList());
        builder.upcomingEvents(upcomingEvents);

        // Sự kiện được thảo luận nhiều
        List<EventResponse> discussedEvents = eventRepository.findEventsWithRecentPosts(PageRequest.of(0, 5))
                .stream().map(eventService::mapToResponse).collect(Collectors.toList());
        builder.discussedEvents(discussedEvents);

        return builder.build();
    }
}
