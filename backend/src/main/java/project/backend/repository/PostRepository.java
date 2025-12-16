package project.backend.repository;

import project.backend.model.Posts;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Posts, Long> {
    java.util.List<Posts> findByEventIdOrderByCreatedAtDesc(Long eventId);
}
