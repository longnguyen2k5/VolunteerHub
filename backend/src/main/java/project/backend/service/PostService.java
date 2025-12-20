package project.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project.backend.dto.request.CommentRequest;
import project.backend.dto.request.PostRequest;
import project.backend.dto.response.CommentResponse;
import project.backend.dto.response.PostResponse;
import project.backend.exception.BadRequestException;
import project.backend.exception.ResourceNotFoundException;
import project.backend.exception.UnauthorizedException;
import project.backend.model.*;
import project.backend.model.enums.EventStatus;
import project.backend.repository.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service xử lý bài viết, bình luận, và lượt thích.
 */
@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final LikeRepository likeRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final RegistrationRepository registrationRepository;
    private final NotificationService notificationService;

    // --- Bài viết (Posts) ---

    /**
     * Lấy danh sách bài viết trong sự kiện.
     */
    public List<PostResponse> getEventPosts(Long eventId, Long currentUserId) {
        Events event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        if (event.getStatus() != EventStatus.APPROVED) {
            throw new BadRequestException("Event is not approved yet");
        }

        List<Posts> posts = postRepository.findByEventIdOrderByCreatedAtDesc(eventId);
        return posts.stream().map(post -> mapToPostResponse(post, currentUserId)).collect(Collectors.toList());
    }

    /**
     * Tạo bài viết mới.
     */
    @Transactional
    public PostResponse createPost(Long eventId, PostRequest request, Long userId) {
        Events event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));
        
        if (event.getStatus() != EventStatus.APPROVED) {
            throw new BadRequestException("Cannot post to an unapproved event");
        }

        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Posts post = new Posts();
        post.setContent(request.getContent());
        post.setEvent(event);
        post.setUser(user);
        post.setCreatedAt(LocalDateTime.now());
        post.setUpdatedAt(LocalDateTime.now());

        Posts savedPost = postRepository.save(post);

        // --- Gửi thông báo ---
        try {
            String title = "Có bài viết mới!";
            String message = String.format("Thành viên %s vừa đăng bài trong sự kiện '%s'.", user.getFullName(), event.getName());

            // Dùng Set để tránh gửi trùng lặp
            java.util.Set<Long> recipientIds = new java.util.HashSet<>();

            // 1. Thêm quản lý
            recipientIds.add(event.getManager().getId());

            // 2. Thêm người tham gia (Đã duyệt/Hoàn thành)
            List<EventRegistrations> registrations = registrationRepository.findByEventId(eventId);
            for (EventRegistrations reg : registrations) {
                if (reg.getStatus() == project.backend.model.enums.RegistrationStatus.APPROVED || 
                    reg.getStatus() == project.backend.model.enums.RegistrationStatus.COMPLETED) {
                    recipientIds.add(reg.getUser().getId());
                }
            }

            // 3. Loại bỏ tác giả bài viết
            recipientIds.remove(userId);

            // 4. Gửi thông báo
            for (Long recipientId : recipientIds) {
                notificationService.sendPushNotification(recipientId, title, message);
            }
        } catch (Exception e) {
            // Log lỗi nhưng không rollback transaction
            System.err.println("Failed to send post notifications: " + e.getMessage());
        }

        return mapToPostResponse(savedPost, userId);
    }
    
    /**
     * Xóa bài viết.
     */
    @Transactional
    public void deletePost(Long eventId, Long postId, Long userId, boolean isAdminOrManager) {
        Posts post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        if (!post.getEvent().getId().equals(eventId)) {
             throw new BadRequestException("Post does not belong to this event");
        }

        if (!post.getUser().getId().equals(userId) && !isAdminOrManager) {
            throw new UnauthorizedException("You are not authorized to delete this post");
        }

        postRepository.delete(post);
    }

    // --- Bình luận (Comments) ---

    /**
     * Lấy danh sách bình luận của bài viết.
     */
    public List<CommentResponse> getPostComments(Long postId) {
        return commentRepository.findByPostIdOrderByCreatedAtAsc(postId).stream()
                .map(this::mapToCommentResponse)
                .collect(Collectors.toList());
    }

    /**
     * Tạo bình luận mới.
     */
    @Transactional
    public CommentResponse createComment(Long eventId, Long postId, CommentRequest request, Long userId) {
        Posts post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
        
        if (!post.getEvent().getId().equals(eventId)) {
             throw new BadRequestException("Post mismatch event");
        }

        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Comments comment = new Comments();
        comment.setContent(request.getContent());
        comment.setPost(post);
        comment.setUser(user);
        comment.setCreatedAt(LocalDateTime.now());
        comment.setUpdatedAt(LocalDateTime.now());

        return mapToCommentResponse(commentRepository.save(comment));
    }
    
    /**
     * Xóa bình luận.
     */
    @Transactional
    public void deleteComment(Long postId, Long commentId, Long userId, boolean isAdminOrManager) {
        Comments comment = commentRepository.findById(commentId)
                 .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));
        
        if (!comment.getPost().getId().equals(postId)) {
             throw new BadRequestException("Comment does not belong to this post");
        }

        if (!comment.getUser().getId().equals(userId) && !isAdminOrManager) {
            throw new UnauthorizedException("You are not authorized to delete this comment");
        }
        
        commentRepository.delete(comment);
    }

    // --- Lượt thích (Likes) ---

    /**
     * Thích bài viết.
     */
    @Transactional
    public project.backend.dto.response.LikeStatusResponse likePost(Long eventId, Long postId, Long userId) {
        Posts post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
        
        boolean exists = likeRepository.existsByPostIdAndUserId(postId, userId);
         
         if (exists) {
             return unlikePost(eventId, postId, userId);
         }

         Users user = userRepository.findById(userId)
                 .orElseThrow(() -> new ResourceNotFoundException("User not found"));

         Likes like = new Likes();
         like.setPost(post);
         like.setUser(user);
         likeRepository.save(like);
         
         // Trả về trạng thái mới
         return project.backend.dto.response.LikeStatusResponse.builder()
                 .isLiked(true)
                 .likeCount(likeRepository.countByPostId(postId)) 
                 .build();
    }

    /**
     * Bỏ thích bài viết.
     */
    @Transactional
    public project.backend.dto.response.LikeStatusResponse unlikePost(Long eventId, Long postId, Long userId) {
        Posts post = postRepository.findById(postId)
                 .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
        Users user = userRepository.findById(userId)
                 .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        likeRepository.findByPostAndUser(post, user).ifPresent(likeRepository::delete);
        
        return project.backend.dto.response.LikeStatusResponse.builder()
                 .isLiked(false)
                 .likeCount(likeRepository.countByPostId(postId))
                 .build();
    }


    // --- Mappers ---

    private PostResponse mapToPostResponse(Posts post, Long currentUserId) {
        int likeCount = likeRepository.countByPostId(post.getId());
        int commentCount = commentRepository.countByPostId(post.getId());
        boolean isLiked = currentUserId != null && likeRepository.existsByPostIdAndUserId(post.getId(), currentUserId);

        return PostResponse.builder()
                .id(post.getId())
                .content(post.getContent())
                .userId(post.getUser().getId())
                .userName(post.getUser().getFullName())
                .eventId(post.getEvent().getId())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .likeCount(likeCount)
                .commentCount(commentCount)
                .isLikedByCurrentUser(isLiked)
                .build();
    }

    private CommentResponse mapToCommentResponse(Comments comment) {
        return CommentResponse.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .userId(comment.getUser().getId())
                .userName(comment.getUser().getFullName())
                .postId(comment.getPost().getId())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }
}
