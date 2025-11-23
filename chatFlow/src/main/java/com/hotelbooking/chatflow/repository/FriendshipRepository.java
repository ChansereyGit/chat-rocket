package com.hotelbooking.chatflow.repository;

import com.hotelbooking.chatflow.entity.Friendship;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Repository
public interface FriendshipRepository extends R2dbcRepository<Friendship, Long> {
    
    @Query("SELECT * FROM friendships WHERE (user_id = :userId OR friend_id = :userId) AND status = :status ORDER BY updated_at DESC")
    Flux<Friendship> findByUserIdAndStatus(Long userId, String status);
    
    @Query("SELECT * FROM friendships WHERE (user_id = :userId OR friend_id = :userId) AND status = 'PENDING' AND requester_id != :userId ORDER BY created_at DESC")
    Flux<Friendship> findPendingRequestsForUser(Long userId);
    
    @Query("SELECT * FROM friendships WHERE " +
           "((user_id = :userId AND friend_id = :friendId) OR (user_id = :friendId AND friend_id = :userId))")
    Mono<Friendship> findByUserIdAndFriendId(Long userId, Long friendId);
    
    @Query("SELECT * FROM friendships WHERE " +
           "((user_id = :userId AND friend_id = :friendId) OR (user_id = :friendId AND friend_id = :userId)) " +
           "AND status = :status")
    Mono<Friendship> findByUserIdAndFriendIdAndStatus(Long userId, Long friendId, String status);
    
    @Query("DELETE FROM friendships WHERE id = :id")
    Mono<Void> deleteById(Long id);
}
