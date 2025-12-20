package project.backend.service;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nl.martijndwars.webpush.Notification;
import nl.martijndwars.webpush.PushService;
import nl.martijndwars.webpush.Subscription;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project.backend.exception.ResourceNotFoundException;
import project.backend.model.PushSubscription;
import project.backend.model.Users;
import project.backend.repository.PushSubscriptionRepository;
import project.backend.repository.UserRepository;

import java.security.Security;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final PushSubscriptionRepository pushSubscriptionRepository;
    private final UserRepository userRepository;

    @Value("${vapid.public.key}")
    private String publicKey;

    @Value("${vapid.private.key}")
    private String privateKey;

    @Value("${vapid.subject}")
    private String subject;

    private PushService pushService;

    @PostConstruct
    private void init() throws Exception {
        if (Security.getProvider(BouncyCastleProvider.PROVIDER_NAME) == null) {
            Security.addProvider(new BouncyCastleProvider());
        }
        pushService = new PushService(publicKey, privateKey, subject);
    }

    @Transactional
    public void subscribe(Long userId, String endpoint, String p256dh, String auth) {
        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Check if subscription exists for this endpoint
        PushSubscription subscription = pushSubscriptionRepository.findByEndpoint(endpoint)
                .orElse(new PushSubscription());
        
        subscription.setUser(user);
        subscription.setEndpoint(endpoint);
        subscription.setP256dh(p256dh);
        subscription.setAuth(auth);
        
        pushSubscriptionRepository.save(subscription);
    }

    @Transactional
    public void unsubscribe(String endpoint) {
        pushSubscriptionRepository.deleteByEndpoint(endpoint);
    }

    private final com.fasterxml.jackson.databind.ObjectMapper objectMapper;

    @Async
    public void sendPushNotification(Long userId, String title, String message) {
        List<PushSubscription> subscriptions = pushSubscriptionRepository.findByUserId(userId);
        if (subscriptions.isEmpty()) {
            return;
        }

        // Deduplicate by endpoint to prevent spam from existing duplicate records
        java.util.Map<String, PushSubscription> uniqueSubscriptions = new java.util.HashMap<>();
        for (PushSubscription sub : subscriptions) {
            uniqueSubscriptions.putIfAbsent(sub.getEndpoint(), sub);
        }

        try {
            java.util.Map<String, String> payloadMap = new java.util.HashMap<>();
            payloadMap.put("title", title);
            payloadMap.put("body", message);
            String payload = objectMapper.writeValueAsString(payloadMap);

            for (PushSubscription sub : uniqueSubscriptions.values()) {
                try {
                    Subscription webPushSub = new Subscription(sub.getEndpoint(), new Subscription.Keys(sub.getP256dh(), sub.getAuth()));
                    Notification notification = new Notification(webPushSub, payload);
                    pushService.send(notification);
                } catch (Exception e) {
                    log.error("Error sending push notification: {}", e.getMessage());
                    if (e.getMessage() != null && e.getMessage().contains("410")) {
                        pushSubscriptionRepository.delete(sub);
                    }
                }
            }
        } catch (Exception e) {
             log.error("Error creating push notification payload: {}", e.getMessage());
        }
    }
}
