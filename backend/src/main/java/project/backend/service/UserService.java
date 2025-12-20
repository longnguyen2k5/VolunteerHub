package project.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project.backend.dto.response.UserResponse;
import project.backend.exception.ResourceNotFoundException;
import project.backend.model.Users;
import project.backend.repository.UserRepository;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service xử lý logic nghiệp vụ cho người dùng.
 */
@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    public UserResponse getUserInfo (String email) {
        Users users = userRepository.findUsersByEmail(email).orElse(null);

        if (users == null){
            return UserResponse.error("User not found");
        }
        return UserResponse.success(users,null);
    }

    @Transactional
    public UserResponse updateProfile(String email, String fullName) {
        Users user = userRepository.findUsersByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setFullName(fullName);
        userRepository.save(user);
        return UserResponse.success(user, "Profile updated successfully");
    }

    /**
     * ADMIN: Lấy danh sách tất cả người dùng.
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
     * ADMIN: Khóa tài khoản người dùng.
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
     * ADMIN: Mở khóa tài khoản người dùng.
     */
    @Transactional
    public UserResponse unlockUser(Long userId) {
        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setIsLocked(false);
        userRepository.save(user);
        return UserResponse.success(user, "User unlocked successfully");
    }
    
    /**
     * ADMIN: Tạo tài khoản Admin mới.
     */
    @Transactional
    public Users createAdmin(project.backend.dto.request.RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new project.backend.exception.BadRequestException("Email already exists");
        }

        Users user = new Users();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(project.backend.model.enums.UserRole.ADMIN);
        user.setIsLocked(false);

        return userRepository.save(user);
    }
}
