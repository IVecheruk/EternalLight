package com.eternallight.backend.infrastructure.db.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "app_user")
@Getter @Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long id;

    @Column(nullable = false, unique = true, length = 120)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    @Column(nullable = false, length = 60)
    private String role; // SUPER_ADMIN / ADMIN / TECHNICIAN / USER

    @Column(name = "is_active", nullable = false)
    private Boolean isActive;

    @Column(name = "blocked_reason", length = 500)
    private String blockedReason;

    @Column(name = "full_name", length = 200)
    private String fullName;

    @Column(name = "address", length = 300)
    private String address;

    @Column(name = "birth_date")
    private LocalDate birthDate;

    @Column(name = "phone", length = 40)
    private String phone;

    @Column(name = "notification_email", length = 120)
    private String notificationEmail;
}
