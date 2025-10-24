package project.backend.config;

import project.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.server.authorization.token.JwtEncodingContext;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class OAuth2TokenCustomizer implements org.springframework.security.oauth2.server.authorization.token.OAuth2TokenCustomizer<JwtEncodingContext> {

    private final UserRepository userRepository;

    @Override
    public void customize(JwtEncodingContext context) {
        Authentication principal = context.getPrincipal();

        if (principal != null) {
            String email = principal.getName();

            // Lấy thông tin user từ database
            userRepository.findUsersByEmail(email).ifPresent(user -> {
                // Thêm custom claims vào JWT token
                context.getClaims().claim("user_id", user.getId());
                context.getClaims().claim("full_name", user.getFullName());
                context.getClaims().claim("email", user.getEmail());
                context.getClaims().claim("role", user.getRole().name());

                // Thêm authorities
                context.getClaims().claim("authorities",
                        principal.getAuthorities().stream()
                                .map(GrantedAuthority::getAuthority)
                                .collect(Collectors.toList())
                );
            });
        }
    }
}