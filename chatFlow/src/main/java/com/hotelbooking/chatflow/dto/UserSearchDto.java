package com.hotelbooking.chatflow.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserSearchDto {
    private Long id;
    private String email;
    private String username;
    private String fullName;
    private String phoneNumber;
    private String avatarUrl;
    private String status;
    private Boolean isOnline;
    private String friendshipStatus; // null, PENDING, ACCEPTED, BLOCKED
    private Boolean isFriend;
}
