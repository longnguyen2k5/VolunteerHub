package project.backend.repository;

import project.backend.model.Events;
import project.backend.model.enums.EventStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

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
}