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
@Table("friendships")
public class Friendship {
    
    @Id
    private Long id;
    
    private Long userId;
    private Long friendId;
    private String status; // PENDING, ACCEPTED, REJECTED, BLOCKED
    private Long requesterId; // Who sent the friend request
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
