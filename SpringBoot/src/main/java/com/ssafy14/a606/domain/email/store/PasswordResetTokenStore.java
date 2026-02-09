package com.ssafy14.a606.domain.email.store;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.time.Duration;

@Component
@RequiredArgsConstructor
public class PasswordResetTokenStore {

    // Redis에 발급된 임시토큰 + userId 저장

    private static final String TOKEN_PREFIX = "email:pwreset:token:";

    private final StringRedisTemplate redisTemplate;

    private String tokenKey(String token) {
        return TOKEN_PREFIX + token;
    }

    public void saveToken(String token, Long userId, Duration ttl) {
        redisTemplate.opsForValue().set(tokenKey(token), String.valueOf(userId), ttl);
    }

    public Long getUserId(String token) {
        String value = redisTemplate.opsForValue().get(tokenKey(token));
        if (value == null || value.isBlank()) return null;

        try {
            return Long.parseLong(value);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    public void deleteToken(String token) {
        redisTemplate.delete(tokenKey(token));
    }
}