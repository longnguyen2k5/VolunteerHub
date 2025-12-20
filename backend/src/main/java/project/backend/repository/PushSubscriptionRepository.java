package project.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import project.backend.model.PushSubscription;

import java.util.List;

/**
 * Repository thao tác với bảng push_subscriptions.
 */
@Repository
public interface PushSubscriptionRepository extends JpaRepository<PushSubscription, Long> {
    List<PushSubscription> findByUserId(Long userId);
    List<PushSubscription> findByEndpoint(String endpoint);
    void deleteByEndpoint(String endpoint);
}
