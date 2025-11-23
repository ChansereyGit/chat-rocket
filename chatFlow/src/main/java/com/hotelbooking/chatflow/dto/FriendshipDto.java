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
public class FriendshipDto {
    private Long id;
    private UserDto friend;
    private String status;
    private Boolean isRequester;
    private LocalDateTime createdAt;
}
