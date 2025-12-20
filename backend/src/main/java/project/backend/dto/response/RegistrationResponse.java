package project.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import project.backend.model.EventRegistrations;
import java.time.LocalDateTime;

/**
 * DTO phản hồi thông tin đăng ký tham gia sự kiện.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegistrationResponse {
    private Long id;
    private Long eventId;
    private String eventName;
    private Long userId;
    private String userName;
    private String status;
    private LocalDateTime registeredAt;
    
    // Thông tin thêm cho lịch sử tham gia
    private LocalDateTime eventStartTime;
    private String eventLocation;

    public static RegistrationResponse fromEntity(EventRegistrations entity) {
        return RegistrationResponse.builder()
                .id(entity.getId())
                .eventId(entity.getEvents().getId())
                .eventName(entity.getEvents().getName())
                .userId(entity.getUser().getId())
                .userName(entity.getUser().getFullName())
                .status(entity.getStatus().name())
                .registeredAt(entity.getRegisteredAt())
                .eventStartTime(entity.getEvents().getStartTime())
                .eventLocation(entity.getEvents().getLocation())
                .build();
    }
}
