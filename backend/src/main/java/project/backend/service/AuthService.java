package project.backend.service;

import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.context.SecurityContextHolderStrategy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project.backend.dto.request.LoginRequest;
import project.backend.dto.request.RegisterRequest;
import project.backend.dto.response.AuthResponse;
import project.backend.model.Users;
import project.backend.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
//    private final AuthenticationConfiguration  authenticationConfiguration;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public AuthResponse register (RegisterRequest registerRequest, HttpServletRequest httpServletRequest) {
        Users user = userRepository.findUsersByEmail(registerRequest.email()).orElse(null);
        if (user == null) {
            Users newUser = new Users();
            newUser.setFullName(registerRequest.fullName());
            newUser.setEmail(registerRequest.email());
            newUser.setPassword(passwordEncoder.encode(registerRequest.password()));
            userRepository.save(newUser);
            HttpSession httpSession = httpServletRequest.getSession(true);
            return AuthResponse.registerSuccess(newUser.getEmail(),
                    newUser.getFullName(),
                    newUser.getRole(),
                    httpSession.getId());
        }
        return AuthResponse.error("Invalid email or password");
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

}
