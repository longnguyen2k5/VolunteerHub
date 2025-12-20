package project.backend.dto.response;

import project.backend.model.enums.EventStatus;
import project.backend.model.enums.EventCategory;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * DTO phản hồi thông tin sự kiện.
 */
@Data
public class EventResponse {
    private Long id;
    private String name;
    private String description;
    private String location;
    private String imageUrl;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Integer maxParticipants;
    private EventCategory category;
    private EventStatus status;
    private Long managerId;
    private String managerName;
    private Integer currentParticipants;
    private LocalDateTime createdAt;
}