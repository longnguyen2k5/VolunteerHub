package project.backend.repository;

import project.backend.model.Comments;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository thao tác với bảng comments.
 */
public interface CommentRepository extends JpaRepository<Comments, Long> {
    java.util.List<Comments> findByPostIdOrderByCreatedAtAsc(Long postId);
    int countByPostId(Long postId);
}
