package project.backend.repository;

import project.backend.model.EventRegistrations;
import project.backend.model.enums.RegistrationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface RegistrationRepository extends JpaRepository<EventRegistrations, Long> {

    List<EventRegistrations> findByUserId(Long userId);

    @Query("SELECT r FROM EventRegistrations r WHERE r.events.id = :eventId")
    List<EventRegistrations> findByEventId(@Param("eventId") Long eventId);

    @Query("SELECT r FROM EventRegistrations r WHERE r.events.id = :eventId AND r.status = :status")
    List<EventRegistrations> findByEventIdAndStatus(@Param("eventId") Long eventId, @Param("status") RegistrationStatus status);

    @Query("SELECT r FROM EventRegistrations r WHERE r.events.id = :eventId AND r.user.id = :userId")
    Optional<EventRegistrations> findByEventIdAndUserId(@Param("eventId") Long eventId, @Param("userId") Long userId);

    @Query("SELECT CASE WHEN COUNT(r) > 0 THEN true ELSE false END FROM EventRegistrations r WHERE r.events.id = :eventId AND r.user.id = :userId")
    Boolean existsByEventIdAndUserId(@Param("eventId") Long eventId, @Param("userId") Long userId);

    @Query("SELECT COUNT(r) FROM EventRegistrations r WHERE r.events.id = :eventId AND r.status = project.backend.model.enums.RegistrationStatus.APPROVED")
    Long countApprovedByEventId(@Param("eventId") Long eventId);
}