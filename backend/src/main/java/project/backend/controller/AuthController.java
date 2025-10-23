package project.backend.controller;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.backend.dto.request.LoginRequest;
import project.backend.dto.request.RegisterRequest;
import project.backend.dto.response.AuthResponse;
import project.backend.service.AuthService;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest registerRequest,
                                                 HttpServletRequest httpServletRequest) {
        AuthResponse result = this.authService.register(registerRequest, httpServletRequest);

        if (result.email() == null) {
            return ResponseEntity.badRequest().body(result);
        }
        return ResponseEntity.ok(result);
    }
    // endpoint /login already create by spring authorization server, so we don't need to implement that.
    // just using PKCE flow to authorize

}
