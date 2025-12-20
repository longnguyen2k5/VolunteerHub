package project.backend.repository;

import project.backend.model.Likes;
import project.backend.model.Posts;
import project.backend.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

/**
 * Repository thao tác với bảng likes.
 */
public interface LikeRepository extends JpaRepository<Likes, Long> {
    int countByPostId(Long postId);
    boolean existsByPostIdAndUserId(Long postId, Long userId);
    Optional<Likes> findByPostAndUser(Posts post, Users user);
}
