package project.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

// Tự động trả về lỗi 403 FORBIDDEN (Không có quyền)
// (Lưu ý: 401 UNAUTHORIZED là khi "chưa đăng nhập",
// còn 403 FORBIDDEN là khi "đã đăng nhập nhưng không có quyền")
@ResponseStatus(HttpStatus.FORBIDDEN)
public class UnauthorizedException extends RuntimeException {

    public UnauthorizedException(String message) {
        super(message);
    }

    public UnauthorizedException(String message, Throwable cause) {
        super(message, cause);
    }
}