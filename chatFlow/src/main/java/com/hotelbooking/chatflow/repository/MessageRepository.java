package com.hotelbooking.chatflow.repository;

import com.hotelbooking.chatflow.entity.Message;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

@Repository
public interface MessageRepository extends R2dbcRepository<Message, Long> {
    @Query("SELECT * FROM messages WHERE (sender_id = :userId OR receiver_id = :userId) ORDER BY created_at DESC")
    Flux<Message> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    @Query("SELECT * FROM messages WHERE " +
           "((sender_id = :userId AND receiver_id = :friendId) OR " +
           "(sender_id = :friendId AND receiver_id = :userId)) " +
           "ORDER BY created_at ASC")
    Flux<Message> findConversationMessages(Long userId, Long friendId);
}
