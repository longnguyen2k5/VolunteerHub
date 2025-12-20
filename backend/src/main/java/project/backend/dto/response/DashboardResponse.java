package project.backend.dto.response;

import lombok.Builder;
import lombok.Data;
import java.util.List;

/**
 * DTO phản hồi dữ liệu Dashboard.
 */
@Data
@Builder
public class DashboardResponse {
    // Thống kê cho Admin/Manager
    private long totalEvents;
    private long totalUsers;
    private long totalRegistrations;
    
    // Danh sách sự kiện cho Volunteer / All
    private List<EventResponse> newEvents;
    private List<EventResponse> upcomingEvents;
    private List<EventResponse> discussedEvents;
}
