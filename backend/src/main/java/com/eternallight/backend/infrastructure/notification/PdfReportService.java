package com.eternallight.backend.infrastructure.notification;

import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDFont;
import org.apache.pdfbox.pdmodel.font.PDType0Font;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;

@Service
@Slf4j
public class PdfReportService {

    private static final String FONT_REGULAR = "/fonts/Arial.ttf";
    private static final String FONT_BOLD = "/fonts/Arial-Bold.ttf";

    public byte[] buildReport(String title, List<String> lines) {
        try (PDDocument doc = new PDDocument()) {
            PDPage page = new PDPage(PDRectangle.A4);
            doc.addPage(page);

            PDType0Font fontRegular = loadFont(doc, FONT_REGULAR);
            PDType0Font fontBold = loadFont(doc, FONT_BOLD);

            PDFont titleFont = fontBold != null
                    ? fontBold
                    : (fontRegular != null ? fontRegular : new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD));
            PDFont bodyFont = fontRegular != null
                    ? fontRegular
                    : new PDType1Font(Standard14Fonts.FontName.HELVETICA);

            try (PDPageContentStream content = new PDPageContentStream(doc, page)) {
                float margin = 40f;
                float yStart = page.getMediaBox().getHeight() - margin;
                float leading = 14f;

                content.beginText();
                content.setFont(titleFont, 16);
                content.newLineAtOffset(margin, yStart);
                content.showText(sanitize(title));

                content.setFont(bodyFont, 11);
                content.newLineAtOffset(0, -leading * 1.5f);

                if (lines != null) {
                    for (String line : lines) {
                        content.showText(sanitize(line));
                        content.newLineAtOffset(0, -leading);
                    }
                }

                content.endText();
            }

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            doc.save(out);
            return out.toByteArray();
        } catch (IOException ex) {
            log.warn("Failed to build PDF report: {}", ex.getMessage());
            return new byte[0];
        }
    }

    private PDType0Font loadFont(PDDocument doc, String path) {
        try (InputStream stream = getClass().getResourceAsStream(path)) {
            if (stream == null) {
                log.warn("PDF font not found: {}", path);
                return null;
            }
            return PDType0Font.load(doc, stream);
        } catch (IOException ex) {
            log.warn("Failed to load PDF font {}: {}", path, ex.getMessage());
            return null;
        }
    }

    private String sanitize(String value) {
        if (value == null) return "";
        return value.replace("\r", " ").replace("\n", " ");
    }
}
