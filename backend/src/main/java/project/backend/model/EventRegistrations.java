package project.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import project.backend.model.enums.RegistrationStatus;

import java.security.Timestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "event_registrations")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class EventRegistrations {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private Users user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id")
    private Events events;

    private RegistrationStatus status;
    private LocalDateTime registeredAt;
    private LocalDateTime updatedAt;
}
