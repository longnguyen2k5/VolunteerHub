package project.backend.repository;

import project.backend.model.Events;
import project.backend.model.enums.EventStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository thao tác với bảng events.
 */
@Repository
public interface EventRepository extends JpaRepository<Events, Long> {

    List<Events> findByStatus(EventStatus status);

    @Query("SELECT e FROM Events e WHERE e.manager.id = :managerId")
    List<Events> findByManagerId(Long managerId);

    List<Events> findByStartTimeBetween(LocalDateTime start, LocalDateTime end);

    @Query("SELECT e FROM Events e WHERE e.status = project.backend.model.enums.EventStatus.APPROVED AND e.startTime > :now ORDER BY e.startTime ASC")
    List<Events> findUpcomingApprovedEvents(@Param("now") LocalDateTime now);

    @Query("SELECT e FROM Events e WHERE e.status = project.backend.model.enums.EventStatus.APPROVED ORDER BY e.createdAt DESC")
    List<Events> findRecentApprovedEvents();
    
    // Top 5 Mới nhất
    List<Events> findTop5ByStatusOrderByCreatedAtDesc(EventStatus status);

    // Top 5 Sắp diễn ra (thời gian bắt đầu sớm nhất tính từ hiện tại)
    List<Events> findTop5ByStatusAndStartTimeAfterOrderByStartTimeAsc(EventStatus status, LocalDateTime now);

    // Top 5 Thảo luận sôi nổi (dựa trên bài viết mới nhất)
    @Query("SELECT e FROM project.backend.model.Posts p JOIN p.event e WHERE e.status = project.backend.model.enums.EventStatus.APPROVED GROUP BY e ORDER BY MAX(p.createdAt) DESC")
    List<Events> findEventsWithRecentPosts(org.springframework.data.domain.Pageable pageable);
}