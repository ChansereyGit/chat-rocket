package com.hotelbooking.chatflow.service;

import com.hotelbooking.chatflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public Mono<Void> setUserOnline(Long userId) {
        return userRepository.findById(userId)
                .flatMap(user -> {
                    user.setIsOnline(true);
                    user.setLastSeen(LocalDateTime.now());
                    user.setUpdatedAt(LocalDateTime.now());
                    return userRepository.save(user);
                })
                .then();
    }

    public Mono<Void> setUserOffline(Long userId) {
        return userRepository.findById(userId)
                .flatMap(user -> {
                    user.setIsOnline(false);
                    user.setLastSeen(LocalDateTime.now());
                    user.setUpdatedAt(LocalDateTime.now());
                    return userRepository.save(user);
                })
                .then();
    }

    public Mono<Void> updateHeartbeat(Long userId) {
        return userRepository.findById(userId)
                .flatMap(user -> {
                    user.setIsOnline(true);
                    user.setLastSeen(LocalDateTime.now());
                    user.setUpdatedAt(LocalDateTime.now());
                    return userRepository.save(user);
                })
                .then();
    }
}
