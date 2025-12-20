package project.backend.repository;

import project.backend.model.Posts;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository thao tác với bảng posts.
 */
public interface PostRepository extends JpaRepository<Posts, Long> {
    java.util.List<Posts> findByEventIdOrderByCreatedAtDesc(Long eventId);
}
