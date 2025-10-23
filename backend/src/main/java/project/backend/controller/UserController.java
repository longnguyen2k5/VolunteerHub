package project.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import project.backend.dto.response.UserResponse;
import project.backend.service.UserService;


@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/info")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<UserResponse> getUserInfo(JwtAuthenticationToken jwtAuthenticationToken) {
        String email = jwtAuthenticationToken.getToken().getSubject();
        try {
            return ResponseEntity.status(HttpStatus.OK).body(userService.getUserInfo(email));
        }catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(UserResponse.error(e.getMessage()));
        }
    }

}
