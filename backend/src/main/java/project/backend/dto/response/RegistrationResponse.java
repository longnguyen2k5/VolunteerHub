package project.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import project.backend.model.EventRegistrations;
import java.time.LocalDateTime;

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

    public static RegistrationResponse fromEntity(EventRegistrations entity) {
        return RegistrationResponse.builder()
                .id(entity.getId())
                .eventId(entity.getEvents().getId())
                .eventName(entity.getEvents().getName())
                .userId(entity.getUser().getId())
                .userName(entity.getUser().getFullName())
                .status(entity.getStatus().name())
                .registeredAt(entity.getRegisteredAt())
                .build();
    }
}
