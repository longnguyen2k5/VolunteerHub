package project.backend.config;

import project.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.server.authorization.token.JwtEncodingContext;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

/**
 * Customizer cho JWT token trong quá trình OAuth2 token encoding.
 * Class này cho phép thêm các thông tin tùy chỉnh (claims) vào JWT token trước khi nó được ký và trả về cho client.
 */
@Component
@RequiredArgsConstructor
public class OAuth2TokenCustomizer implements org.springframework.security.oauth2.server.authorization.token.OAuth2TokenCustomizer<JwtEncodingContext> {

    private final UserRepository userRepository;

    /**
     * Phương thức này được gọi khi Authorization Server đang tạo JWT token.
     * Tại đây, chúng ta có thể thêm các claim tùy chỉnh vào token.
     *
     * @param context Context chứa thông tin về token đang được mã hóa (principal, authorization, claims, etc.)
     */
    @Override
    public void customize(JwtEncodingContext context) {
        Authentication principal = context.getPrincipal();

        if (principal != null) {
            String email = principal.getName();

            // Lấy thông tin user từ cơ sở dữ liệu dựa trên email
            userRepository.findUsersByEmail(email).ifPresent(user -> {
                // Thêm các thông tin bổ sung của user vào JWT claims
                context.getClaims().claim("user_id", user.getId());
                context.getClaims().claim("full_name", user.getFullName());
                context.getClaims().claim("email", user.getEmail());
                context.getClaims().claim("role", user.getRole().name());

                // Thêm danh sách authorities (quyền hạn) vào claims để client có thể kiểm tra
                context.getClaims().claim("authorities",
                        principal.getAuthorities().stream()
                                .map(GrantedAuthority::getAuthority)
                                .collect(Collectors.toList())
                );
            });
        }
    }
}