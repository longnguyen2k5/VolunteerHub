package project.backend.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import project.backend.model.enums.UserRole;

import java.time.LocalDateTime;


@Entity
@Table(name = "users")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Users {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String fullName;

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @Column(nullable = false, length = 255)
    private String password;


    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role; // mặc định

    @Column(nullable = false)
    private Boolean isLocked;

    @Column(updatable = false, insertable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        if (isLocked == null) {
            isLocked = false;
        }
        if (role == null) {
            role = UserRole.VOLUNTEER;
        }
    }
}
