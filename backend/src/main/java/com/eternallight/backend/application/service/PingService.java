package com.eternallight.backend.application.service;

import org.springframework.stereotype.Service;

@Service
public class PingService {
    public String pong() {
        return "pong";
    }
}