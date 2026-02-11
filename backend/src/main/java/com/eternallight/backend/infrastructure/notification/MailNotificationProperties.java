package com.eternallight.backend.infrastructure.notification;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "app.mail")
@Getter
@Setter
public class MailNotificationProperties {
    private boolean enabled = true;
    private String from;
}
