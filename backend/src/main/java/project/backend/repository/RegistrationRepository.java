package project.backend.repository;

import project.backend.model.EventRegistrations;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RegistrationRepository extends JpaRepository<EventRegistrations, Long> {
}
