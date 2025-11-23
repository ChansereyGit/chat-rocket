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
public class MessageDto {
    private Long id;
    private Long senderId;
    private Long receiverId;
    private String content;
    private String messageType;
    private Boolean isRead;
    private LocalDateTime createdAt;
    private UserDto sender;
    private UserDto receiver;
}
