package project.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import project.backend.model.enums.RegistrationStatus;

import java.time.LocalDateTime;

/**
 * Entity lưu trữ thông tin đăng ký tham gia sự kiện của người dùng.
 */
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

    @Enumerated(EnumType.STRING)
    private RegistrationStatus status;
    private LocalDateTime registeredAt;
    private LocalDateTime updatedAt;
}
