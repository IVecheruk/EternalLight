package com.eternallight.backend.infrastructure.notification;

import com.eternallight.backend.domain.model.WorkAct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.nio.charset.StandardCharsets;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class NotificationService {

    private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm XXX");

    private final JavaMailSender mailSender;
    private final MailNotificationProperties notificationProperties;
    private final NotificationRecipientResolver recipientResolver;
    private final PdfReportService pdfReportService;

    @Value("${spring.mail.username:}")
    private String mailUsername;

    private record Detail(String label, String value) {}

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

        OffsetDateTime eventTime = OffsetDateTime.now();

        List<Detail> details = new ArrayList<>();
        details.add(new Detail("ID акта", safe(workActId)));
        if (actNumber != null && !actNumber.isBlank()) {
            details.add(new Detail("Номер акта", actNumber.trim()));
        }
        details.add(new Detail("Тип неисправности", safe(faultTypeName)));
        details.add(new Detail("ID типа", safe(faultTypeId)));
        details.add(new Detail("Выбрано", boolLabel(isSelected)));
        if (otherText != null && !otherText.isBlank()) {
            details.add(new Detail("Другое", otherText.trim()));
        }
        details.add(new Detail("Время события", formatDateTime(eventTime)));

        String summary = "В системе зарегистрирована неисправность по акту. Проверьте детали и при необходимости назначьте работы.";
        String plainText = buildPlainText("Зафиксирована неисправность", summary, details, "PDF-отчет во вложении.");
        String html = buildHtml(
                "Зафиксирована неисправность",
                "Неисправность",
                "#fff7ed",
                "#9a3412",
                summary,
                details,
                "PDF-отчет во вложении."
        );

        byte[] pdf = pdfReportService.buildReport(
                "Неисправность",
                buildPdfLines("Зафиксирована неисправность", summary, details)
        );
        sendEmail("EternalLight: зарегистрирована неисправность", plainText, html, pdf, "fault-work-act-" + workActId + ".pdf");
    }

    public void sendWorkActClosed(WorkAct workAct) {
        if (workAct == null) return;

        OffsetDateTime eventTime = OffsetDateTime.now();

        List<Detail> details = new ArrayList<>();
        details.add(new Detail("ID акта", safe(workAct.getId())));
        if (workAct.getActNumber() != null && !workAct.getActNumber().isBlank()) {
            details.add(new Detail("Номер акта", workAct.getActNumber().trim()));
        }
        if (workAct.getWorkFinishedAt() != null) {
            details.add(new Detail("Окончание работ", formatDateTime(workAct.getWorkFinishedAt())));
        }
        if (workAct.getExecutorOrgId() != null) {
            details.add(new Detail("Организация-исполнитель (ID)", String.valueOf(workAct.getExecutorOrgId())));
        }
        if (workAct.getLightingObjectId() != null) {
            details.add(new Detail("Объект освещения (ID)", String.valueOf(workAct.getLightingObjectId())));
        }
        if (workAct.getGrandTotalAmount() != null) {
            details.add(new Detail("Итого, руб.", String.valueOf(workAct.getGrandTotalAmount())));
        }
        details.add(new Detail("Статус", "Закрыт"));
        details.add(new Detail("Время события", formatDateTime(eventTime)));

        String summary = "Акт работ закрыт. Работы завершены и система зафиксировала окончание.";
        String plainText = buildPlainText("Акт закрыт", summary, details, "PDF-отчет во вложении.");
        String html = buildHtml(
                "Акт закрыт",
                "Закрыт",
                "#ecfdf3",
                "#166534",
                summary,
                details,
                "PDF-отчет во вложении."
        );

        byte[] pdf = pdfReportService.buildReport(
                "Акт закрыт",
                buildPdfLines("Акт закрыт", summary, details)
        );
        sendEmail("EternalLight: акт закрыт", plainText, html, pdf, "work-act-" + workAct.getId() + "-closed.pdf");
    }

    private void sendEmail(String subject, String plainText, String html, byte[] pdf, String filename) {
        if (!notificationProperties.isEnabled()) {
            log.info("Notification skipped: app.mail.enabled=false");
            return;
        }

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
            String recipient = recipientOpt.get();
            log.info("Sending notification email to={} subject={}", recipient, subject);
            MimeMessage message = mailSender.createMimeMessage();
            boolean hasAttachment = pdf != null && pdf.length > 0;
            MimeMessageHelper helper = new MimeMessageHelper(message, hasAttachment, StandardCharsets.UTF_8.name());
            helper.setTo(recipient);
            helper.setFrom(from);
            helper.setSubject(subject);
            if (html != null && !html.isBlank()) {
                helper.setText(plainText, html);
            } else {
                helper.setText(plainText, false);
            }

            if (hasAttachment) {
                helper.addAttachment(filename, new ByteArrayResource(pdf));
            }

            mailSender.send(message);
            log.info("Notification email sent to={} subject={}", recipient, subject);
        } catch (MessagingException | MailException ex) {
            log.warn("Failed to send notification email: {}", ex.getMessage());
        } catch (Exception ex) {
            log.warn("Unexpected error while sending notification email", ex);
        }
    }

    private String safe(Object value) {
        return value == null ? "-" : String.valueOf(value);
    }

    private String boolLabel(Boolean value) {
        if (value == null) return "-";
        return value ? "Да" : "Нет";
    }

    private String formatDateTime(OffsetDateTime value) {
        if (value == null) return "-";
        return value.format(DATE_TIME_FORMATTER);
    }

    private List<String> buildPdfLines(String eventTitle, String summary, List<Detail> details) {
        List<String> lines = new ArrayList<>();
        lines.add("Событие: " + eventTitle);
        lines.add("Описание: " + summary);
        for (Detail detail : details) {
            lines.add(detail.label() + ": " + detail.value());
        }
        return lines;
    }

    private String buildPlainText(String title, String summary, List<Detail> details, String footer) {
        StringBuilder sb = new StringBuilder();
        sb.append(title).append("\n");
        sb.append(summary).append("\n\n");
        sb.append("Детали:\n");
        for (Detail detail : details) {
            sb.append("- ").append(detail.label()).append(": ").append(detail.value()).append("\n");
        }
        if (footer != null && !footer.isBlank()) {
            sb.append("\n").append(footer);
        }
        return sb.toString();
    }

    private String buildHtml(
            String title,
            String badgeText,
            String badgeBackground,
            String badgeColor,
            String summary,
            List<Detail> details,
            String footer
    ) {
        StringBuilder sb = new StringBuilder();
        sb.append("<!doctype html><html><head><meta charset=\"UTF-8\"></head>");
        sb.append("<body style=\"margin:0;padding:0;background:#f4f6fb;\">");
        sb.append("<div style=\"max-width:640px;margin:24px auto;padding:0 16px;\">");
        sb.append("<div style=\"background:#ffffff;border-radius:16px;border:1px solid #e5e7eb;padding:24px;font-family:'Segoe UI',Arial,sans-serif;color:#111827;\">");
        sb.append("<div style=\"display:flex;align-items:flex-start;justify-content:space-between;gap:16px;\">");
        sb.append("<div>");
        sb.append("<div style=\"font-size:20px;font-weight:700;\">").append(escapeHtml(title)).append("</div>");
        sb.append("<div style=\"margin-top:4px;font-size:12px;color:#6b7280;\">EternalLight • уведомление</div>");
        sb.append("</div>");
        sb.append("<div style=\"font-size:12px;padding:6px 10px;background:")
                .append(badgeBackground)
                .append(";color:")
                .append(badgeColor)
                .append(";border-radius:999px;\">")
                .append(escapeHtml(badgeText))
                .append("</div>");
        sb.append("</div>");

        sb.append("<div style=\"margin-top:16px;background:#f8fafc;padding:14px;border-radius:12px;\">");
        sb.append("<div style=\"font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#6b7280;\">Что произошло</div>");
        sb.append("<div style=\"margin-top:8px;font-size:14px;color:#111827;line-height:1.5;\">")
                .append(escapeHtml(summary))
                .append("</div>");
        sb.append("</div>");

        sb.append("<div style=\"margin-top:18px;\">");
        sb.append("<div style=\"font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#6b7280;\">Детали</div>");
        sb.append("<table style=\"width:100%;margin-top:8px;border-collapse:collapse;\">");
        for (Detail detail : details) {
            sb.append("<tr>");
            sb.append("<td style=\"padding:8px 0;color:#6b7280;font-size:13px;width:42%;\">")
                    .append(escapeHtml(detail.label()))
                    .append("</td>");
            sb.append("<td style=\"padding:8px 0;color:#111827;font-size:13px;font-weight:600;\">")
                    .append(escapeHtml(detail.value()))
                    .append("</td>");
            sb.append("</tr>");
        }
        sb.append("</table>");
        sb.append("</div>");

        if (footer != null && !footer.isBlank()) {
            sb.append("<div style=\"margin-top:16px;font-size:12px;color:#6b7280;\">")
                    .append(escapeHtml(footer))
                    .append("</div>");
        }

        sb.append("</div>");
        sb.append("<div style=\"text-align:center;font-size:11px;color:#9ca3af;margin:14px 0;\">Это автоматическое уведомление EternalLight.</div>");
        sb.append("</div></body></html>");
        return sb.toString();
    }

    private String escapeHtml(String value) {
        if (value == null) return "";
        return value.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }
}
