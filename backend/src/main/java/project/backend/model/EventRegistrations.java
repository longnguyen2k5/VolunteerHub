package project.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import project.backend.model.enums.EventStatus;

import java.security.Timestamp;

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

    private EventStatus status;
    private Timestamp registeredAt;
    private Timestamp updatedAt;
}
