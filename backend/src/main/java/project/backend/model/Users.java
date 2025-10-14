package project.backend.model;

import jakarta.persistence.*;
import lombok.*;
import project.backend.model.enums.UserRole;
import java.security.Timestamp;

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
    private String fullName;
    private String email;
    private String password; // hashed
    private UserRole role;
    private Boolean isLocked;
    private Timestamp createTime;
    private Timestamp updateTime;
}
