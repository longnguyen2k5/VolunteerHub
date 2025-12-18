package project.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PostResponse {
    private Long id;
    private String content;
    private Long userId;
    private String userName;
    private Long eventId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Statistics
    private int likeCount;
    private int commentCount;
    
    @com.fasterxml.jackson.annotation.JsonProperty("isLikedByCurrentUser")
    private boolean isLikedByCurrentUser;
}
