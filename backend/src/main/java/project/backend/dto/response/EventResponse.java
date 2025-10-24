package project.backend.dto.response;

import project.backend.model.enums.EventStatus;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class EventResponse {
    private Long id;
    private String name;
    private String description;
    private String location;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private EventStatus status;
    private Long managerId;
    private String managerName;
    private Integer currentParticipants;
    private LocalDateTime createdAt;
}