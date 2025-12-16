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

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    // --- Posts ---

    @GetMapping("/{eventId}/posts")
    public ResponseEntity<List<PostResponse>> getEventPosts(
            @PathVariable Long eventId,
            Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        return ResponseEntity.ok(postService.getEventPosts(eventId, userId));
    }

    @PostMapping("/{eventId}/posts")
    public ResponseEntity<PostResponse> createPost(
            @PathVariable Long eventId,
            @Valid @RequestBody PostRequest request,
            Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(postService.createPost(eventId, request, userId));
    }

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

    @PostMapping("/{eventId}/posts/{postId}/like")
    public ResponseEntity<Void> likePost(
            @PathVariable Long eventId,
            @PathVariable Long postId,
            Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        postService.likePost(eventId, postId, userId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{eventId}/posts/{postId}/like")
    public ResponseEntity<Void> unlikePost(
            @PathVariable Long eventId,
            @PathVariable Long postId,
            Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        postService.unlikePost(eventId, postId, userId);
        return ResponseEntity.ok().build();
    }

    // --- Comments ---

    @GetMapping("/{eventId}/posts/{postId}/comments")
    public ResponseEntity<List<CommentResponse>> getComments(
            @PathVariable Long eventId,
            @PathVariable Long postId) {
        return ResponseEntity.ok(postService.getPostComments(postId));
    }

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
    private Long getUserIdFromAuth(Authentication authentication) {
        if (authentication != null && authentication.getPrincipal() instanceof Jwt jwt) {
            return jwt.getClaim("user_id");
        }
        return null; 
    }
    
    private boolean isAdminOrManager(Authentication authentication) {
        if (authentication != null) {
            return authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN") || a.getAuthority().equals("ROLE_EVENT_MANAGER"));
        }
        return false;
    }
}
