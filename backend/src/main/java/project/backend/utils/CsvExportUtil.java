package project.backend.utils;

import java.io.PrintWriter;
import java.util.List;
import java.util.stream.Collectors;
import java.io.ByteArrayOutputStream;
import java.io.OutputStreamWriter;
import java.nio.charset.StandardCharsets;

public class CsvExportUtil {

    public static byte[] exportUsersToCsv(List<project.backend.model.Users> users) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream();
             PrintWriter writer = new PrintWriter(new OutputStreamWriter(baos, StandardCharsets.UTF_8))) {
            
            // BOM for Excel compatibility
            baos.write(0xEF);
            baos.write(0xBB);
            baos.write(0xBF);

            // Header
            writer.println("ID,Full Name,Email,Role,Status,Created At");

            // Data
            for (project.backend.model.Users user : users) {
                writer.printf("%d,\"%s\",\"%s\",\"%s\",\"%s\",\"%s\"%n",
                        user.getId(),
                        escapeSpecialCharacters(user.getFullName()),
                        escapeSpecialCharacters(user.getEmail()),
                        user.getRole(),
                        user.getIsLocked() ? "Locked" : "Active",
                        user.getCreatedAt()
                );
            }
            writer.flush();
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error exporting CSV: " + e.getMessage());
        }
    }

    public static byte[] exportRegistrationsToCsv(List<project.backend.model.EventRegistrations> registrations) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream();
             PrintWriter writer = new PrintWriter(new OutputStreamWriter(baos, StandardCharsets.UTF_8))) {
            
            // BOM for Excel compatibility
            baos.write(0xEF);
            baos.write(0xBB);
            baos.write(0xBF);

            // Header
            writer.println("Event ID,Event Name,User ID,User Name,Email,Status,Registered At");

            // Data
            for (project.backend.model.EventRegistrations reg : registrations) {
                writer.printf("%d,\"%s\",%d,\"%s\",\"%s\",\"%s\",\"%s\"%n",
                        reg.getEvents() != null ? reg.getEvents().getId() : 0,
                        reg.getEvents() != null ? escapeSpecialCharacters(reg.getEvents().getName()) : "",
                        reg.getUser() != null ? reg.getUser().getId() : 0,
                        reg.getUser() != null ? escapeSpecialCharacters(reg.getUser().getFullName()) : "",
                        reg.getUser() != null ? escapeSpecialCharacters(reg.getUser().getEmail()) : "",
                        reg.getStatus(),
                        reg.getRegisteredAt()
                );
            }
            writer.flush();
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error exporting CSV: " + e.getMessage());
        }
    }

    private static String escapeSpecialCharacters(String data) {
        if (data == null) {
            return "";
        }
        String escapedData = data.replaceAll("\\R", " ");
        if (data.contains(",") || data.contains("\"") || data.contains("'")) {
            data = data.replace("\"", "\"\"");
            escapedData = data;
        }
        return escapedData;
    }
}
