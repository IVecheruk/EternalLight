package com.eternallight.backend.infrastructure.notification;

import com.eternallight.backend.domain.model.WorkAct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.nio.charset.StandardCharsets;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class NotificationService {

    private final JavaMailSender mailSender;
    private final MailNotificationProperties notificationProperties;
    private final NotificationRecipientResolver recipientResolver;
    private final PdfReportService pdfReportService;

    @Value("${spring.mail.username:}")
    private String mailUsername;

    public void sendFaultAdded(
            Long workActId,
            String actNumber,
            Long faultTypeId,
            String faultTypeName,
            Boolean isSelected,
            String otherText
    ) {
        boolean shouldNotify = Boolean.TRUE.equals(isSelected) || (otherText != null && !otherText.isBlank());
        if (!shouldNotify) return;

        List<String> lines = new ArrayList<>();
        lines.add("Event: Fault reported");
        lines.add("Work act ID: " + safe(workActId));
        if (actNumber != null && !actNumber.isBlank()) {
            lines.add("Act number: " + actNumber.trim());
        }
        lines.add("Fault type: " + safe(faultTypeName) + " (id=" + safe(faultTypeId) + ")");
        if (otherText != null && !otherText.isBlank()) {
            lines.add("Other text: " + otherText.trim());
        }
        lines.add("Selected: " + (isSelected != null ? isSelected : "null"));
        lines.add("Timestamp: " + OffsetDateTime.now());

        byte[] pdf = pdfReportService.buildReport("Fault notification", lines);
        sendEmail("EternalLight: fault reported", String.join("\n", lines), pdf, "fault-work-act-" + workActId + ".pdf");
    }

    public void sendWorkActClosed(WorkAct workAct) {
        if (workAct == null) return;

        List<String> lines = new ArrayList<>();
        lines.add("Event: Work act closed");
        lines.add("Work act ID: " + safe(workAct.getId()));
        if (workAct.getActNumber() != null && !workAct.getActNumber().isBlank()) {
            lines.add("Act number: " + workAct.getActNumber().trim());
        }
        if (workAct.getWorkFinishedAt() != null) {
            lines.add("Finished at: " + workAct.getWorkFinishedAt());
        }
        if (workAct.getExecutorOrgId() != null) {
            lines.add("Executor org ID: " + workAct.getExecutorOrgId());
        }
        if (workAct.getLightingObjectId() != null) {
            lines.add("Lighting object ID: " + workAct.getLightingObjectId());
        }
        if (workAct.getGrandTotalAmount() != null) {
            lines.add("Grand total amount: " + workAct.getGrandTotalAmount());
        }
        lines.add("Timestamp: " + OffsetDateTime.now());

        byte[] pdf = pdfReportService.buildReport("Work act closed", lines);
        sendEmail("EternalLight: work act closed", String.join("\n", lines), pdf, "work-act-" + workAct.getId() + "-closed.pdf");
    }

    private void sendEmail(String subject, String body, byte[] pdf, String filename) {
        if (!notificationProperties.isEnabled()) return;

        var recipientOpt = recipientResolver.resolveRecipientEmail();
        if (recipientOpt.isEmpty()) {
            log.info("Notification skipped: no recipient resolved");
            return;
        }

        String from = notificationProperties.getFrom();
        if (from == null || from.isBlank()) {
            from = mailUsername;
        }
        if (from == null || from.isBlank()) {
            log.warn("Notification skipped: mail from address not configured");
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            boolean hasAttachment = pdf != null && pdf.length > 0;
            MimeMessageHelper helper = new MimeMessageHelper(message, hasAttachment, StandardCharsets.UTF_8.name());
            helper.setTo(recipientOpt.get());
            helper.setFrom(from);
            helper.setSubject(subject);
            helper.setText(body, false);

            if (hasAttachment) {
                helper.addAttachment(filename, new ByteArrayResource(pdf));
            }

            mailSender.send(message);
        } catch (MessagingException ex) {
            log.warn("Failed to send notification email: {}", ex.getMessage());
        }
    }

    private String safe(Object value) {
        return value == null ? "-" : String.valueOf(value);
    }
}
