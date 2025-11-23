package com.hotelbooking.chatflow.service;

import com.hotelbooking.chatflow.dto.ConversationDto;
import com.hotelbooking.chatflow.dto.MessageDto;
import com.hotelbooking.chatflow.dto.SendMessageRequest;
import com.hotelbooking.chatflow.dto.UserDto;
import com.hotelbooking.chatflow.entity.Message;
import com.hotelbooking.chatflow.entity.User;
import com.hotelbooking.chatflow.repository.MessageRepository;
import com.hotelbooking.chatflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    public Mono<MessageDto> sendMessage(Long senderId, SendMessageRequest request) {
        return userRepository.findById(request.getReceiverId())
                .switchIfEmpty(Mono.error(new RuntimeException("Receiver not found")))
                .flatMap(receiver -> {
                    Message message = Message.builder()
                            .senderId(senderId)
                            .receiverId(request.getReceiverId())
                            .content(request.getContent())
                            .messageType(request.getMessageType())
                            .isRead(false)
                            .createdAt(LocalDateTime.now())
                            .build();
                    
                    return messageRepository.save(message);
                })
                .flatMap(savedMessage -> mapToMessageDto(savedMessage));
    }

    public Flux<MessageDto> getConversationMessages(Long userId, Long friendId) {
        return messageRepository.findConversationMessages(userId, friendId)
                .flatMap(message -> mapToMessageDto(message));
    }

    public Flux<ConversationDto> getConversations(Long userId) {
        return messageRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .collectMultimap(message -> {
                    // Group by the other user (friend)
                    return message.getSenderId().equals(userId) 
                            ? message.getReceiverId() 
                            : message.getSenderId();
                })
                .flatMapMany(conversationsMap -> {
                    return Flux.fromIterable(conversationsMap.entrySet())
                            .flatMap(entry -> {
                                Long friendId = entry.getKey();
                                var messages = entry.getValue();
                                
                                // Get last message
                                Message lastMessage = messages.stream()
                                        .max((m1, m2) -> m1.getCreatedAt().compareTo(m2.getCreatedAt()))
                                        .orElse(null);
                                
                                // Count unread messages
                                long unreadCount = messages.stream()
                                        .filter(m -> m.getReceiverId().equals(userId) && !m.getIsRead())
                                        .count();
                                
                                return userRepository.findById(friendId)
                                        .map(friend -> {
                                            MessageDto lastMsgDto = null;
                                            if (lastMessage != null) {
                                                lastMsgDto = MessageDto.builder()
                                                        .id(lastMessage.getId())
                                                        .content(lastMessage.getContent())
                                                        .createdAt(lastMessage.getCreatedAt())
                                                        .senderId(lastMessage.getSenderId())
                                                        .receiverId(lastMessage.getReceiverId())
                                                        .isRead(lastMessage.getIsRead())
                                                        .build();
                                            }
                                            
                                            return ConversationDto.builder()
                                                    .friend(mapToUserDto(friend))
                                                    .lastMessage(lastMsgDto)
                                                    .unreadCount((int) unreadCount)
                                                    .build();
                                        });
                            });
                })
                .sort((c1, c2) -> {
                    if (c1.getLastMessage() == null) return 1;
                    if (c2.getLastMessage() == null) return -1;
                    return c2.getLastMessage().getCreatedAt()
                            .compareTo(c1.getLastMessage().getCreatedAt());
                });
    }

    public Mono<Void> markAsRead(Long userId, Long messageId) {
        return messageRepository.findById(messageId)
                .filter(message -> message.getReceiverId().equals(userId))
                .flatMap(message -> {
                    message.setIsRead(true);
                    return messageRepository.save(message);
                })
                .then();
    }

    public Mono<Void> markConversationAsRead(Long userId, Long friendId) {
        return messageRepository.findConversationMessages(userId, friendId)
                .filter(message -> message.getReceiverId().equals(userId) && !message.getIsRead())
                .flatMap(message -> {
                    message.setIsRead(true);
                    return messageRepository.save(message);
                })
                .then();
    }

    private Mono<MessageDto> mapToMessageDto(Message message) {
        Mono<User> senderMono = userRepository.findById(message.getSenderId());
        Mono<User> receiverMono = userRepository.findById(message.getReceiverId());
        
        return Mono.zip(senderMono, receiverMono)
                .map(tuple -> MessageDto.builder()
                        .id(message.getId())
                        .senderId(message.getSenderId())
                        .receiverId(message.getReceiverId())
                        .content(message.getContent())
                        .messageType(message.getMessageType())
                        .isRead(message.getIsRead())
                        .createdAt(message.getCreatedAt())
                        .sender(mapToUserDto(tuple.getT1()))
                        .receiver(mapToUserDto(tuple.getT2()))
                        .build());
    }

    private UserDto mapToUserDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .phoneNumber(user.getPhoneNumber())
                .avatarUrl(user.getAvatarUrl())
                .status(user.getStatus())
                .bio(user.getBio())
                .isOnline(user.getIsOnline())
                .lastSeen(user.getLastSeen())
                .build();
    }
}
