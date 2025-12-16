package project.backend.dto.response;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class DashboardResponse {
    // For Admin/Manager
    private long totalEvents;
    private long totalUsers;
    private long totalRegistrations;
    
    // For Volunteer / All
    private List<EventResponse> newEvents;
    private List<EventResponse> upcomingEvents;
    private List<EventResponse> discussedEvents;
}
