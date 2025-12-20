package project.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import project.backend.model.enums.EventStatus;
import project.backend.model.enums.EventCategory;
import java.time.LocalDateTime;

@Entity
@Table(name = "events")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Events {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private String location;
    
    @Column(length = 500)
    private String imageUrl;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    
    private Integer maxParticipants;
    
    @Enumerated(EnumType.STRING)
    private EventCategory category;
    
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private EventStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "manager_id")
    private Users manager;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
