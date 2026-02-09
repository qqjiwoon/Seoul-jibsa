package com.ssafy14.a606.domain.email.service;

import com.ssafy14.a606.domain.email.store.PasswordResetTokenStore;
import com.ssafy14.a606.domain.user.entity.User;
import com.ssafy14.a606.domain.user.repository.UserRepository;
import com.ssafy14.a606.global.mail.EmailSender;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Duration;
import java.util.Base64;

@Service
@RequiredArgsConstructor
public class PasswordResetEmailServiceImpl implements PasswordResetEmailService {

    private static final Duration RESET_TOKEN_TTL = Duration.ofMinutes(15);

    private final UserRepository userRepository;
    private final PasswordResetTokenStore passwordResetTokenStore;
    private final EmailSender emailSender;

    @Value("${app.front-base-url:http://localhost:5173}")
    private String frontBaseUrl;

    @Override
    public void sendPasswordResetEmail(String email) {

        // 1) 이메일로 유저 조회 (없으면 조용히 종료 - 응답은 컨트롤러에서 200 OK로 통일)
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) return;

        // 2) 토큰 생성 + Redis 저장 (token -> userId, TTL)
        String token = generateResetToken();
        passwordResetTokenStore.saveToken(token, user.getId(), RESET_TOKEN_TTL);

        // 3) 링크 생성
        String resetLink = frontBaseUrl + "/reset-password?token=" + token;

        // 4) 메일 발송
        String subject = "[서울집사] 비밀번호 재설정 안내";
        String content = buildHtml(resetLink);

        emailSender.send(email, subject, content);
    }

    private String buildHtml(String resetLink) {
        return """
                <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                  <h2>비밀번호 재설정</h2>
                  <p>아래 버튼을 눌러 비밀번호를 재설정해 주세요.</p>
                  <p>
                    <a href="%s"
                       style="display:inline-block; padding:12px 18px; text-decoration:none; border-radius:8px;">
                      비밀번호 재설정하기
                    </a>
                  </p>
                  <p>이 링크는 일정 시간이 지나면 만료됩니다.</p>
                  <p>본인이 요청하지 않았다면 이 메일을 무시해 주세요.</p>
                </div>
                """.formatted(resetLink);
    }

    private String generateResetToken() {
        // URL-safe 토큰 (패딩 제거)
        byte[] bytes = new byte[32];
        new SecureRandom().nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }


}
