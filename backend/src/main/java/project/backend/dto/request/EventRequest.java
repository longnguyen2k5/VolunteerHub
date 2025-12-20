package project.backend.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * DTO yêu cầu tạo/cập nhật sự kiện.
 */
@Data
public class EventRequest {

    @NotBlank(message = "Name is required")
    @Size(max = 255)
    private String name;

    @NotBlank(message = "Description is required")
    @Size(max = 5000, message = "Description must be less than 5000 characters")
    private String description;

    @NotBlank(message = "Location is required")
    @Size(max = 255)
    private String location;

    @Size(max = 500)
    private String imageUrl;

    @NotNull(message = "Start time is required")
    @Future(message = "Start time must be in the future")
    private LocalDateTime startTime;

    @NotNull(message = "End time is required")
    @Future(message = "End time must be in the future")
    private LocalDateTime endTime;

    @NotNull(message = "Max participants is required")
    @Min(value = 1, message = "Min participants is 1")
    private Integer maxParticipants;
    
    private String category;
}