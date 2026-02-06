package com.eternallight.backend.api.exception;

import com.eternallight.backend.common.error.ErrorResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleAny(Exception ex) {
        return ResponseEntity.internalServerError()
                .body(new ErrorResponse("ETERNAL_ERROR", ex.getMessage()));
    }
}