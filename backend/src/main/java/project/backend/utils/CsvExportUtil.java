package project.backend.utils;

import java.io.ByteArrayOutputStream;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.util.List;

/**
 * Utility class hỗ trợ xuất dữ liệu ra file CSV.
 */
public class CsvExportUtil {

    /**
     * Xuất danh sách người dùng ra CSV.
     */
    public static byte[] exportUsersToCsv(List<project.backend.model.Users> users) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream();
             PrintWriter writer = new PrintWriter(new OutputStreamWriter(baos, StandardCharsets.UTF_8))) {
            
            // BOM for Excel compatibility (UTF-8 with BOM)
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

    /**
     * Xuất danh sách đăng ký tham gia sự kiện ra CSV.
     */
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

    /**
     * Xuất danh sách sự kiện ra CSV.
     */
    public static byte[] exportEventsToCsv(List<project.backend.model.Events> events) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream();
             PrintWriter writer = new PrintWriter(new OutputStreamWriter(baos, StandardCharsets.UTF_8))) {
            
            // BOM for Excel compatibility
            baos.write(0xEF);
            baos.write(0xBB);
            baos.write(0xBF);

            // Header
            writer.println("ID,Name,Manager,Location,Start Time,End Time,Status,Category,Created At");

            // Data
            for (project.backend.model.Events event : events) {
                writer.printf("%d,\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\"%n",
                        event.getId(),
                        escapeSpecialCharacters(event.getName()),
                        event.getManager() != null ? escapeSpecialCharacters(event.getManager().getFullName()) : "",
                        escapeSpecialCharacters(event.getLocation()),
                        event.getStartTime(),
                        event.getEndTime(),
                        event.getStatus(),
                        event.getCategory(),
                        event.getCreatedAt()
                );
            }
            writer.flush();
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error exporting CSV: " + e.getMessage());
        }
    }

    /**
     * Xử lý ký tự đặc biệt trong CSV để tránh lỗi format.
     */
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
