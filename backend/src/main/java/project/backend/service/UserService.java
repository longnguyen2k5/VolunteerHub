package project.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project.backend.dto.response.UserResponse;
import project.backend.exception.ResourceNotFoundException;
import project.backend.model.Users;
import project.backend.repository.UserRepository;

import java.util.List;
import java.util.stream.Collectors;


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

    /**
     * ADMIN: Get all users
     */
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> UserResponse.success(user, null))
                .collect(Collectors.toList());
    }

    public List<Users> getAllUsersEntity() {
        return userRepository.findAll();
    }

    /**
     * ADMIN: Lock a user account
     */
    @Transactional
    public UserResponse lockUser(Long userId) {
        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setIsLocked(true);
        userRepository.save(user);
        return UserResponse.success(user, "User locked successfully");
    }

    /**
     * ADMIN: Unlock a user account
     */
    @Transactional
    public UserResponse unlockUser(Long userId) {
        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setIsLocked(false);
        userRepository.save(user);
        return UserResponse.success(user, "User unlocked successfully");
    }
}
