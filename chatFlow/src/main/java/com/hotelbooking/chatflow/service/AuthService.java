package com.hotelbooking.chatflow.service;

import com.hotelbooking.chatflow.dto.AuthResponse;
import com.hotelbooking.chatflow.dto.LoginRequest;
import com.hotelbooking.chatflow.dto.RegisterRequest;
import com.hotelbooking.chatflow.dto.UserDto;
import com.hotelbooking.chatflow.entity.User;
import com.hotelbooking.chatflow.repository.UserRepository;
import com.hotelbooking.chatflow.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public Mono<AuthResponse> register(RegisterRequest request) {
        return userRepository.existsByEmail(request.getEmail())
                .flatMap(exists -> {
                    if (exists) {
                        return Mono.error(new RuntimeException("Email already exists"));
                    }
                    return userRepository.existsByUsername(request.getUsername());
                })
                .flatMap(exists -> {
                    if (exists) {
                        return Mono.error(new RuntimeException("Username already exists"));
                    }
                    
                    User user = User.builder()
                            .email(request.getEmail())
                            .username(request.getUsername())
                            .fullName(request.getFullName())
                            .password(passwordEncoder.encode(request.getPassword()))
                            .avatarUrl("https://ui-avatars.com/api/?name=" + request.getFullName().replace(" ", "+") + "&background=random")
                            .status("online")
                            .isOnline(true)
                            .lastSeen(LocalDateTime.now())
                            .createdAt(LocalDateTime.now())
                            .updatedAt(LocalDateTime.now())
                            .build();
                    
                    return userRepository.save(user);
                })
                .map(user -> {
                    String token = jwtUtil.generateToken(user.getEmail(), user.getId());
                    return AuthResponse.builder()
                            .token(token)
                            .user(mapToUserDto(user))
                            .build();
                });
    }

    public Mono<AuthResponse> login(LoginRequest request) {
        return userRepository.findByEmail(request.getEmail())
                .switchIfEmpty(Mono.error(new RuntimeException("Invalid email or password")))
                .flatMap(user -> {
                    if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                        return Mono.error(new RuntimeException("Invalid email or password"));
                    }
                    
                    user.setIsOnline(true);
                    user.setLastSeen(LocalDateTime.now());
                    user.setUpdatedAt(LocalDateTime.now());
                    
                    return userRepository.save(user)
                            .map(updatedUser -> {
                                String token = jwtUtil.generateToken(updatedUser.getEmail(), updatedUser.getId());
                                return AuthResponse.builder()
                                        .token(token)
                                        .user(mapToUserDto(updatedUser))
                                        .build();
                            });
                });
    }

    private UserDto mapToUserDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .avatarUrl(user.getAvatarUrl())
                .status(user.getStatus())
                .bio(user.getBio())
                .isOnline(user.getIsOnline())
                .lastSeen(user.getLastSeen())
                .isAuthenticated(true)
                .build();
    }
}
