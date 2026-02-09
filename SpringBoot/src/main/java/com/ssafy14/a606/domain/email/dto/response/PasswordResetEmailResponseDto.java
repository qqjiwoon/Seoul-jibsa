package com.ssafy14.a606.domain.email.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class PasswordResetEmailResponseDto {

    private boolean success;
    private String message;

    public static PasswordResetEmailResponseDto ok() {
        return PasswordResetEmailResponseDto.builder()
                .success(true)
                .message("비밀번호 재설정 이메일을 전송했습니다.")
                .build();
    }

}
