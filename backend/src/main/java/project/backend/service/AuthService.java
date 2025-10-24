package project.backend.service;

import project.backend.dto.request.RegisterRequest;
import project.backend.exception.BadRequestException;
import project.backend.model.Users;
import project.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public void register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists");
        }

        Users user = new Users();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setIsLocked(false);

        userRepository.save(user);
    }
}
//    public AuthResponse loginForOAuth2(LoginRequest request, HttpServletRequest httpRequest)
//            throws Exception {
//        try {
//            // 1. Authenticate
//            AuthenticationManager authManager = authenticationConfiguration.getAuthenticationManager();
//            Authentication authentication = authManager.authenticate(
//                    UsernamePasswordAuthenticationToken.unauthenticated(
//                            request.email(),
//                            request.password()
//                    )
//            );
//
//            // 2. Tạo SecurityContext
//            SecurityContext context = SecurityContextHolder.createEmptyContext();
//            context.setAuthentication(authentication);
//            SecurityContextHolder.setContext(context);
//
//            // 3. LƯU vào SESSION (QUAN TRỌNG cho OAuth2 flow!)
//            HttpSession session = httpRequest.getSession(true);
//            session.setAttribute(
//                    HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,
//                    context
//            );
//            return AuthResponse.success(request.email(), session.getId());
//        } catch (Exception e) {
//            return AuthResponse.error(e.getMessage());
//        }
//    }

