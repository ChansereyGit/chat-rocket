package com.hotelbooking.chatflow.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private Long id;
    private String email;
    private String username;
    private String fullName;
    private String phoneNumber;
    private String avatarUrl;
    private String status;
    private String bio;
    private Boolean isOnline;
    private LocalDateTime lastSeen;
    private Boolean isAuthenticated;
}
