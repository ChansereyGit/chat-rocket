package com.hotelbooking.chatflow.controller;

import com.hotelbooking.chatflow.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/status/online")
    public Mono<ResponseEntity<Void>> setOnline(@RequestHeader("X-User-Id") Long userId) {
        return userService.setUserOnline(userId)
                .then(Mono.just(ResponseEntity.ok().<Void>build()));
    }

    @PostMapping("/status/offline")
    public Mono<ResponseEntity<Void>> setOffline(@RequestHeader("X-User-Id") Long userId) {
        return userService.setUserOffline(userId)
                .then(Mono.just(ResponseEntity.ok().<Void>build()));
    }

    @PostMapping("/heartbeat")
    public Mono<ResponseEntity<Void>> heartbeat(@RequestHeader("X-User-Id") Long userId) {
        return userService.updateHeartbeat(userId)
                .then(Mono.just(ResponseEntity.ok().<Void>build()));
    }
}
