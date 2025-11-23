package com.hotelbooking.chatflow.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table("messages")
public class Message {
    
    @Id
    private Long id;
    
    private Long senderId;
    private Long receiverId;
    private String content;
    private String messageType;
    private Boolean isRead;
    private LocalDateTime createdAt;
}
