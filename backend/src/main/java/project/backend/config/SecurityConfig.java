package project.backend.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.server.authorization.config.annotation.web.configurers.OAuth2AuthorizationServerConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

/**
 * Cấu hình bảo mật chính của ứng dụng.
 * Định nghĩa các chuỗi lọc bảo mật (SecurityFilterChain) cho cả Authorization Server và các API thông thường.
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationConverter jwtAuthenticationConverter;

    /**
     * Cấu hình Security Filter Chain dành riêng cho các endpoint của OAuth2 Authorization Server.
     * Bean này có độ ưu tiên cao nhất (Order 1) để đảm bảo các yêu cầu OAuth2 được xử lý bởi cấu hình này.
     *
     * @param http HttpSecurity
     * @return SecurityFilterChain
     * @throws Exception nếu có lỗi cấu hình
     */
    @Bean
    @Order(1)
    public SecurityFilterChain authorizationServerSecurityFilterChain(HttpSecurity http)
            throws Exception {

        OAuth2AuthorizationServerConfigurer authServerConfigurer =
                OAuth2AuthorizationServerConfigurer.authorizationServer();

        http
                .securityMatcher(authServerConfigurer.getEndpointsMatcher())
                .with(authServerConfigurer, configurer -> configurer.oidc(Customizer.withDefaults()))
                // Cấu hình CORS cho các endpoint OAuth2 (ví dụ: /oauth2/token)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(auth ->
                        auth.anyRequest().authenticated()
                )
                .csrf(csrf -> csrf.ignoringRequestMatchers(
                        authServerConfigurer.getEndpointsMatcher()
                ))
                // Form Login để xác thực người dùng (hữu ích khi test trên trình duyệt hoặc Postman)
                .formLogin(form -> form
                        .loginPage("/login")
                        .failureHandler((request, response, exception) -> {
                            String errorParam = "?error";
                            if (exception instanceof LockedException) {
                                errorParam = "?error=locked";
                            }
                            response.sendRedirect("/login" + errorParam);
                        })
                        .permitAll()
                );

        return http.build();
    }

    /**
     * Cấu hình Security Filter Chain mặc định cho toàn bộ ứng dụng (Resource Server).
     * Xử lý xác thực cho các API endpoints và trang quản trị.
     * Order = 2
     *
     * @param http HttpSecurity
     * @return SecurityFilterChain
     * @throws Exception nếu có lỗi cấu hình
     */
    @Bean
    @Order(2)
    public SecurityFilterChain defaultSecurityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable()) // Tắt CSRF cho API (thường dùng JWT)
                .authorizeHttpRequests(authorize -> authorize
                        // Các endpoint công khai không cần xác thực
                        .requestMatchers("/api/auth/register").permitAll()
                        .requestMatchers("/api/events/public/**").permitAll()
                        .requestMatchers("/api/events/upcoming").permitAll()
                        .requestMatchers("/login", "/error", "/css/**", "/js/**", "/images/**", "/webjars/**", "/uploads/**").permitAll()

                        // Endpoint dành riêng cho Admin
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        // Các endpoint Events (phân quyền cụ thể sẽ dùng @PreAuthorize ở Controller)
                        .requestMatchers("/api/events/**").authenticated()

                        // Tất cả các request còn lại yêu cầu phải đăng nhập
                        .anyRequest().authenticated()
                )
                .formLogin(form -> form
                        .loginPage("/login")
                        .failureHandler((request, response, exception) -> {
                            String errorParam = "?error";
                            if (exception instanceof LockedException) {
                                errorParam = "?error=locked";
                            }
                            response.sendRedirect("/login" + errorParam);
                        })
                        .permitAll()
                )
                // Cấu hình Resource Server sử dụng JWT
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter))
                )
                .logout(logout -> logout
                        .logoutRequestMatcher(request -> request.getMethod().equals("GET") && request.getRequestURI().equals("/logout"))
                        .logoutSuccessUrl("http://localhost:3000/login")
                        .invalidateHttpSession(true)
                        .deleteCookies("JSESSIONID")
                        .permitAll()
                );

        return http.build();
    }

    /**
     * Cấu hình CORS (Cross-Origin Resource Sharing).
     * Cho phép frontend (http://localhost:3000) gọi API backend.
     *
     * @return CorsConfigurationSource
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    /**
     * Bean PasswordEncoder sử dụng BCrypt để mã hóa mật khẩu.
     *
     * @return PasswordEncoder
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}