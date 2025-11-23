package com.hotelbooking.chatflow.controller;

import com.hotelbooking.chatflow.dto.ConversationDto;
import com.hotelbooking.chatflow.dto.MessageDto;
import com.hotelbooking.chatflow.dto.SendMessageRequest;
import com.hotelbooking.chatflow.service.MessageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @PostMapping
    public Mono<ResponseEntity<MessageDto>> sendMessage(
            @RequestHeader("X-User-Id") Long userId,
            @Valid @RequestBody SendMessageRequest request) {
        return messageService.sendMessage(userId, request)
                .map(ResponseEntity::ok);
    }

    @GetMapping("/conversations")
    public Flux<ConversationDto> getConversations(@RequestHeader("X-User-Id") Long userId) {
        return messageService.getConversations(userId);
    }

    @GetMapping("/conversation/{friendId}")
    public Flux<MessageDto> getConversationMessages(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long friendId) {
        return messageService.getConversationMessages(userId, friendId);
    }

    @PutMapping("/{messageId}/read")
    public Mono<ResponseEntity<Void>> markAsRead(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long messageId) {
        return messageService.markAsRead(userId, messageId)
                .then(Mono.just(ResponseEntity.ok().<Void>build()));
    }

    @PutMapping("/conversation/{friendId}/read")
    public Mono<ResponseEntity<Void>> markConversationAsRead(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long friendId) {
        return messageService.markConversationAsRead(userId, friendId)
                .then(Mono.just(ResponseEntity.ok().<Void>build()));
    }
}
