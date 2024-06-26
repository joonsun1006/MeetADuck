package com.ssafy.duck.domain.chat.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.zalando.problem.Status;

@Getter
@AllArgsConstructor
public enum ChatErrorCode {

    NOT_FOUND_CHAT(Status.NOT_FOUND, "채팅방을 찾을 수 없습니다."),
    NOT_FOUND_TOPIC(Status.NOT_FOUND, "토픽을 찾을 수 없습니다.");
    // 채팅방 조회에 실패했습니다.
    // 토픽 조회에 실패했습니다.
    // 메시지 전송에 실패했습니다.
    // 메시지 조회에 실패했습니다.

    private final Status status;
    private final String detail;

}
