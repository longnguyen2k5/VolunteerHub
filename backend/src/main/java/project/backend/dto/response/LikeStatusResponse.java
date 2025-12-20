package project.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO phản hồi trạng thái like.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LikeStatusResponse {
    @com.fasterxml.jackson.annotation.JsonProperty("isLiked")
    private boolean isLiked;
    private int likeCount;
}
