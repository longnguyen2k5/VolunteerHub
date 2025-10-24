package project.backend.repository;

import project.backend.model.Users;
import project.backend.model.enums.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<Users, Long> {
    Optional<Users> findUsersByEmail(String email);
    Boolean existsByEmail(String email);
    List<Users> findByRole(UserRole role);
    List<Users> findByIsLocked(Boolean isLocked);
}
