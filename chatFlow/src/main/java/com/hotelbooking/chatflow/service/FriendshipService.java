package com.hotelbooking.chatflow.service;

import com.hotelbooking.chatflow.dto.FriendshipDto;
import com.hotelbooking.chatflow.dto.UserDto;
import com.hotelbooking.chatflow.dto.UserSearchDto;
import com.hotelbooking.chatflow.entity.Friendship;
import com.hotelbooking.chatflow.entity.User;
import com.hotelbooking.chatflow.repository.FriendshipRepository;
import com.hotelbooking.chatflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class FriendshipService {

    private final FriendshipRepository friendshipRepository;
    private final UserRepository userRepository;

    public Mono<FriendshipDto> sendFriendRequest(Long userId, Long friendId) {
        if (userId.equals(friendId)) {
            return Mono.error(new RuntimeException("Cannot send friend request to yourself"));
        }

        return friendshipRepository.findByUserIdAndFriendId(userId, friendId)
                .flatMap(existing -> Mono.error(new RuntimeException("Friend request already exists")))
                .switchIfEmpty(
                        userRepository.findById(friendId)
                                .switchIfEmpty(Mono.error(new RuntimeException("User not found")))
                                .flatMap(friend -> {
                                    Friendship friendship = Friendship.builder()
                                            .userId(userId)
                                            .friendId(friendId)
                                            .status("PENDING")
                                            .requesterId(userId)
                                            .createdAt(LocalDateTime.now())
                                            .updatedAt(LocalDateTime.now())
                                            .build();
                                    
                                    return friendshipRepository.save(friendship)
                                            .flatMap(saved -> mapToFriendshipDto(saved, userId));
                                })
                )
                .cast(FriendshipDto.class);
    }

    public Mono<FriendshipDto> acceptFriendRequest(Long userId, Long friendshipId) {
        return friendshipRepository.findById(friendshipId)
                .switchIfEmpty(Mono.error(new RuntimeException("Friend request not found")))
                .flatMap(friendship -> {
                    if (!friendship.getFriendId().equals(userId) && !friendship.getUserId().equals(userId)) {
                        return Mono.error(new RuntimeException("Unauthorized"));
                    }
                    
                    if (!"PENDING".equals(friendship.getStatus())) {
                        return Mono.error(new RuntimeException("Friend request is not pending"));
                    }
                    
                    friendship.setStatus("ACCEPTED");
                    friendship.setUpdatedAt(LocalDateTime.now());
                    
                    return friendshipRepository.save(friendship)
                            .flatMap(saved -> mapToFriendshipDto(saved, userId));
                });
    }

    public Mono<Void> rejectFriendRequest(Long userId, Long friendshipId) {
        return friendshipRepository.findById(friendshipId)
                .switchIfEmpty(Mono.error(new RuntimeException("Friend request not found")))
                .flatMap(friendship -> {
                    if (!friendship.getFriendId().equals(userId) && !friendship.getUserId().equals(userId)) {
                        return Mono.error(new RuntimeException("Unauthorized"));
                    }
                    
                    return friendshipRepository.deleteById(friendshipId);
                });
    }

    public Mono<Void> removeFriend(Long userId, Long friendshipId) {
        return friendshipRepository.findById(friendshipId)
                .switchIfEmpty(Mono.error(new RuntimeException("Friendship not found")))
                .flatMap(friendship -> {
                    if (!friendship.getFriendId().equals(userId) && !friendship.getUserId().equals(userId)) {
                        return Mono.error(new RuntimeException("Unauthorized"));
                    }
                    
                    return friendshipRepository.deleteById(friendshipId);
                });
    }

    public Flux<FriendshipDto> getFriends(Long userId) {
        return friendshipRepository.findByUserIdAndStatus(userId, "ACCEPTED")
                .flatMap(friendship -> mapToFriendshipDto(friendship, userId));
    }

    public Flux<FriendshipDto> getPendingRequests(Long userId) {
        return friendshipRepository.findPendingRequestsForUser(userId)
                .flatMap(friendship -> mapToFriendshipDto(friendship, userId));
    }

    public Flux<UserSearchDto> searchUsers(Long currentUserId, String query) {
        if (query == null || query.trim().isEmpty()) {
            return Flux.empty();
        }

        String searchTerm = query.toLowerCase();
        
        return userRepository.findAll()
                .filter(user -> !user.getId().equals(currentUserId))
                .filter(user -> {
                    boolean matchesUsername = user.getUsername() != null && 
                            user.getUsername().toLowerCase().contains(searchTerm);
                    boolean matchesFullName = user.getFullName() != null && 
                            user.getFullName().toLowerCase().contains(searchTerm);
                    boolean matchesEmail = user.getEmail() != null && 
                            user.getEmail().toLowerCase().contains(searchTerm);
                    boolean matchesPhone = user.getPhoneNumber() != null && 
                            user.getPhoneNumber().contains(query); // Exact match for phone
                    
                    return matchesUsername || matchesFullName || matchesEmail || matchesPhone;
                })
                .flatMap(user -> 
                    friendshipRepository.findByUserIdAndFriendId(currentUserId, user.getId())
                            .map(friendship -> mapToUserSearchDto(user, friendship))
                            .defaultIfEmpty(mapToUserSearchDto(user, null))
                )
                .take(20); // Limit results
    }

    private Mono<FriendshipDto> mapToFriendshipDto(Friendship friendship, Long currentUserId) {
        Long friendUserId = friendship.getUserId().equals(currentUserId) 
                ? friendship.getFriendId() 
                : friendship.getUserId();
        
        return userRepository.findById(friendUserId)
                .map(friendUser -> FriendshipDto.builder()
                        .id(friendship.getId())
                        .friend(mapToUserDto(friendUser))
                        .status(friendship.getStatus())
                        .isRequester(friendship.getRequesterId().equals(currentUserId))
                        .createdAt(friendship.getCreatedAt())
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

    private UserSearchDto mapToUserSearchDto(User user, Friendship friendship) {
        return UserSearchDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .phoneNumber(user.getPhoneNumber())
                .avatarUrl(user.getAvatarUrl())
                .status(user.getStatus())
                .isOnline(user.getIsOnline())
                .friendshipStatus(friendship != null ? friendship.getStatus() : null)
                .isFriend(friendship != null && "ACCEPTED".equals(friendship.getStatus()))
                .build();
    }
}
