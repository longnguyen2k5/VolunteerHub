package project.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import project.backend.dto.response.UserResponse;
import project.backend.model.Users;
import project.backend.repository.UserRepository;


@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public UserResponse getUserInfo (String email) {
        Users users = userRepository.findUsersByEmail(email).orElse(null);

        if (users == null){
            return UserResponse.error("User not found");
        }
        return UserResponse.success(users,null);
    }
}
