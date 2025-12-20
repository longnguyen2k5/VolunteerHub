package project.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO phản hồi thông tin bình luận.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CommentResponse {
    private Long id;
    private String content;
    private Long userId;
    private String userName;
    private Long postId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
