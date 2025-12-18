package project.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project.backend.dto.request.CommentRequest;
import project.backend.dto.request.PostRequest;
import project.backend.dto.response.CommentResponse;
import project.backend.dto.response.LikeStatusResponse;
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

@Service
@RequiredArgsConstructor
public class PostService {

    // ... (omitted)

    // --- Likes ---

    @Transactional
    public LikeStatusResponse likePost(Long eventId, Long postId, Long userId) {
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
         
         // Return new status
         return LikeStatusResponse.builder()
                 .isLiked(true)
                 .likeCount(likeRepository.countByPostId(postId)) 
                 .build();
    }

    @Transactional
    public LikeStatusResponse unlikePost(Long eventId, Long postId, Long userId) {
        Posts post = postRepository.findById(postId)
                 .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
        Users user = userRepository.findById(userId)
                 .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        likeRepository.findByPostAndUser(post, user).ifPresent(likeRepository::delete);
        
        return LikeStatusResponse.builder()
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
