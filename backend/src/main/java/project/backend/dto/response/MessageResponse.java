package project.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * DTO phản hồi tin nhắn đơn giản.
 */
@Data
@AllArgsConstructor
public class MessageResponse {
    private String message;
}