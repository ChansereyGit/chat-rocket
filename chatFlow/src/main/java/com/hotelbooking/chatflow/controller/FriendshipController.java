package com.hotelbooking.chatflow.controller;

import com.hotelbooking.chatflow.dto.FriendRequestDto;
import com.hotelbooking.chatflow.dto.FriendshipDto;
import com.hotelbooking.chatflow.dto.UserSearchDto;
import com.hotelbooking.chatflow.service.FriendshipService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/friendships")
@RequiredArgsConstructor
public class FriendshipController {

    private final FriendshipService friendshipService;

    @PostMapping("/request")
    public Mono<ResponseEntity<FriendshipDto>> sendFriendRequest(
            @RequestHeader("X-User-Id") Long userId,
            @Valid @RequestBody FriendRequestDto request) {
        return friendshipService.sendFriendRequest(userId, request.getFriendId())
                .map(ResponseEntity::ok)
                .onErrorResume(e -> Mono.just(
                        ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null)
                ));
    }

    @PutMapping("/{friendshipId}/accept")
    public Mono<ResponseEntity<FriendshipDto>> acceptFriendRequest(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long friendshipId) {
        return friendshipService.acceptFriendRequest(userId, friendshipId)
                .map(ResponseEntity::ok)
                .onErrorResume(e -> Mono.just(
                        ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null)
                ));
    }

    @DeleteMapping("/{friendshipId}/reject")
    public Mono<ResponseEntity<Void>> rejectFriendRequest(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long friendshipId) {
        return friendshipService.rejectFriendRequest(userId, friendshipId)
                .then(Mono.just(ResponseEntity.ok().<Void>build()))
                .onErrorResume(e -> Mono.just(
                        ResponseEntity.status(HttpStatus.BAD_REQUEST).build()
                ));
    }

    @DeleteMapping("/{friendshipId}")
    public Mono<ResponseEntity<Void>> removeFriend(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long friendshipId) {
        return friendshipService.removeFriend(userId, friendshipId)
                .then(Mono.just(ResponseEntity.ok().<Void>build()))
                .onErrorResume(e -> Mono.just(
                        ResponseEntity.status(HttpStatus.BAD_REQUEST).build()
                ));
    }

    @GetMapping("/friends")
    public Flux<FriendshipDto> getFriends(@RequestHeader("X-User-Id") Long userId) {
        return friendshipService.getFriends(userId);
    }

    @GetMapping("/pending")
    public Flux<FriendshipDto> getPendingRequests(@RequestHeader("X-User-Id") Long userId) {
        return friendshipService.getPendingRequests(userId);
    }

    @GetMapping("/search")
    public Flux<UserSearchDto> searchUsers(
            @RequestHeader("X-User-Id") Long userId,
            @RequestParam String query) {
        return friendshipService.searchUsers(userId, query);
    }
}
