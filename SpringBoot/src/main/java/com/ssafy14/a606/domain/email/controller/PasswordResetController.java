package com.ssafy14.a606.domain.email.controller;

import com.ssafy14.a606.domain.email.dto.request.PasswordResetEmailRequestDto;
import com.ssafy14.a606.domain.email.dto.response.PasswordResetEmailResponseDto;
import com.ssafy14.a606.domain.email.service.PasswordResetEmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth/recovery")
public class PasswordResetController {

    private final PasswordResetEmailService passwordResetEmailService;

    /**
     * 비밀번호 재설정 메일 발송 요청
     * - 보안상 이메일 존재 여부를 노출하지 않기 위해 항상 200 OK를 반환
     */
    @PostMapping("/password")
    public ResponseEntity<PasswordResetEmailResponseDto> requestResetEmail(
            @RequestBody PasswordResetEmailRequestDto requestDto
    ) {
        passwordResetEmailService.sendPasswordResetEmail(requestDto.getEmail());
        return ResponseEntity.ok(PasswordResetEmailResponseDto.ok());
    }

}
