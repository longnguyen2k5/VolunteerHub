package project.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import project.backend.dto.request.CommentRequest;
import project.backend.dto.request.PostRequest;
import project.backend.dto.response.CommentResponse;
import project.backend.dto.response.PostResponse;
import project.backend.service.PostService;

import java.util.List;

import project.backend.model.Users;
import project.backend.repository.UserRepository;

/**
 * Controller quản lý Bài viết, Bình luận và Tương tác (Like).
 */
@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;
    private final UserRepository userRepository;

    // --- Posts ---

    /**
     * Lấy danh sách bài viết thảo luận của một sự kiện.
     */
    @GetMapping("/{eventId}/posts")
    public ResponseEntity<List<PostResponse>> getEventPosts(
            @PathVariable Long eventId,
            Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        return ResponseEntity.ok(postService.getEventPosts(eventId, userId));
    }

    /**
     * Tạo bài viết thảo luận mới trong sự kiện.
     */
    @PostMapping("/{eventId}/posts")
    public ResponseEntity<PostResponse> createPost(
            @PathVariable Long eventId,
            @Valid @RequestBody PostRequest request,
            Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(postService.createPost(eventId, request, userId));
    }

    /**
     * Xóa bài viết (Người tạo hoặc Admin/Manager).
     */
    @DeleteMapping("/{eventId}/posts/{postId}")
    public ResponseEntity<Void> deletePost(
            @PathVariable Long eventId,
            @PathVariable Long postId,
            Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        boolean isAdminOrManager = isAdminOrManager(authentication);
        postService.deletePost(eventId, postId, userId, isAdminOrManager);
        return ResponseEntity.noContent().build();
    }

    // --- Likes ---

    /**
     * Like một bài viết.
     */
    @PostMapping("/{eventId}/posts/{postId}/like")
    public ResponseEntity<project.backend.dto.response.LikeStatusResponse> likePost(
            @PathVariable Long eventId,
            @PathVariable Long postId,
            Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        return ResponseEntity.ok(postService.likePost(eventId, postId, userId));
    }

    /**
     * Unlike một bài viết.
     */
    @DeleteMapping("/{eventId}/posts/{postId}/like")
    public ResponseEntity<project.backend.dto.response.LikeStatusResponse> unlikePost(
            @PathVariable Long eventId,
            @PathVariable Long postId,
            Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        return ResponseEntity.ok(postService.unlikePost(eventId, postId, userId));
    }

    // --- Comments ---

    /**
     * Lấy danh sách bình luận của một bài viết.
     */
    @GetMapping("/{eventId}/posts/{postId}/comments")
    public ResponseEntity<List<CommentResponse>> getComments(
            @PathVariable Long eventId,
            @PathVariable Long postId) {
        return ResponseEntity.ok(postService.getPostComments(postId));
    }

    /**
     * Tạo bình luận mới cho bài viết.
     */
    @PostMapping("/{eventId}/posts/{postId}/comments")
    public ResponseEntity<CommentResponse> createComment(
            @PathVariable Long eventId,
            @PathVariable Long postId,
            @Valid @RequestBody CommentRequest request,
            Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(postService.createComment(eventId, postId, request, userId));
    }
    
    /**
     * Xóa bình luận (Người tạo hoặc Admin/Manager).
     */
    @DeleteMapping("/{eventId}/posts/{postId}/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long eventId,
            @PathVariable Long postId,
            @PathVariable Long commentId,
            Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
         boolean isAdminOrManager = isAdminOrManager(authentication);
        postService.deleteComment(postId, commentId, userId, isAdminOrManager);
        return ResponseEntity.noContent().build();
    }

    // --- Helpers ---
    
    /**
     * Helper: Lấy User ID từ JWT token hoặc Database theo Email.
     */
    private Long getUserIdFromAuth(Authentication authentication) {
        if (authentication != null && authentication.getPrincipal() instanceof Jwt jwt) {
            // 1. Thử lấy từ 'user_id' claim
            Object userIdObj = jwt.getClaims().get("user_id");
            if (userIdObj instanceof Number) {
                return ((Number) userIdObj).longValue();
            } else if (userIdObj instanceof String) {
                try { return Long.parseLong((String) userIdObj); } catch (NumberFormatException e) {}
            }
            
            // 2. Thử lấy từ 'email' claim -> Database Lookup
            String email = jwt.getClaimAsString("email");
            if (email != null) {
                return userRepository.findUsersByEmail(email)
                        .map(Users::getId)
                        .orElse(null);
            }
            
            // 3. Thử lấy từ subject nếu là email
            String subject = authentication.getName();
            if (subject != null && subject.contains("@")) {
                 return userRepository.findUsersByEmail(subject)
                        .map(Users::getId)
                        .orElse(null);
            }
        }
        return null; 
    }
    
    /**
     * Helper: Kiểm tra quyền Admin hoặc Event Manager.
     */
    private boolean isAdminOrManager(Authentication authentication) {
        if (authentication != null) {
            return authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN") || a.getAuthority().equals("ROLE_EVENT_MANAGER"));
        }
        return false;
    }
}
