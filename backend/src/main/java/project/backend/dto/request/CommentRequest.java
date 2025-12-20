package project.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

/**
 * DTO yêu cầu tạo/cập nhật bình luận.
 */
@Getter
@Setter
public class CommentRequest {
    @NotBlank(message = "Content cannot be empty")
    private String content;
}
