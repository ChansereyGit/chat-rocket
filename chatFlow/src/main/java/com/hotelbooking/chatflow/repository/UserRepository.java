package com.hotelbooking.chatflow.repository;

import com.hotelbooking.chatflow.entity.User;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

@Repository
public interface UserRepository extends R2dbcRepository<User, Long> {
    Mono<User> findByEmail(String email);
    Mono<User> findByUsername(String username);
    Mono<Boolean> existsByEmail(String email);
    Mono<Boolean> existsByUsername(String username);
}
