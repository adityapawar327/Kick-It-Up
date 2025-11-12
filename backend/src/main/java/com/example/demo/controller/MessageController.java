package com.example.demo.controller;

import com.example.demo.dto.MessageRequest;
import com.example.demo.dto.MessageResponse;
import com.example.demo.model.Message;
import com.example.demo.model.User;
import com.example.demo.service.MessageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/messages")
public class MessageController {
    
    private static final Logger logger = LoggerFactory.getLogger(MessageController.class);
    
    @Autowired
    private MessageService messageService;
    
    @PostMapping
    public ResponseEntity<?> sendMessage(@RequestBody MessageRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        
        try {
            logger.info("User {} attempting to send message", username);
            
            Message message = messageService.sendMessage(request);
            
            logger.info("Message sent successfully from {} to user ID {}", username, request.getReceiverId());
            return ResponseEntity.ok(new MessageResponse(message));
            
        } catch (IllegalArgumentException e) {
            logger.warn("Invalid message request from {}: {}", username, e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
            
        } catch (SecurityException e) {
            logger.warn("Security violation by {}: {}", username, e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", e.getMessage()));
            
        } catch (Exception e) {
            logger.error("Error sending message from {}: {}", username, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to send message. Please try again."));
        }
    }
    
    @GetMapping("/conversation/{userId}")
    public ResponseEntity<?> getConversation(@PathVariable Long userId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        
        try {
            logger.debug("User {} fetching conversation with user ID {}", username, userId);
            
            List<Message> messages = messageService.getConversation(userId);
            List<MessageResponse> response = messages.stream()
                    .map(MessageResponse::new)
                    .collect(Collectors.toList());
            
            logger.debug("Returned {} messages for conversation", response.size());
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            logger.warn("Invalid conversation request from {}: {}", username, e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
            
        } catch (SecurityException e) {
            logger.warn("Unauthorized conversation access attempt by {}: {}", username, e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Access denied"));
            
        } catch (Exception e) {
            logger.error("Error fetching conversation for {}: {}", username, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to load conversation"));
        }
    }
    
    @GetMapping("/partners")
    public ResponseEntity<?> getConversationPartners() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        
        try {
            logger.debug("User {} fetching conversation partners", username);
            
            List<User> partners = messageService.getConversationPartners();
            
            if (partners == null || partners.isEmpty()) {
                logger.debug("No conversation partners found for {}", username);
                return ResponseEntity.ok(List.of());
            }
            
            List<Map<String, Object>> response = partners.stream()
                    .filter(user -> {
                        boolean valid = user != null && user.getId() != null && user.getUsername() != null;
                        if (!valid) {
                            logger.warn("Invalid user found in partners list for {}", username);
                        }
                        return valid;
                    })
                    .map(user -> {
                        Long unreadCount = 0L;
                        try {
                            unreadCount = messageService.getUnreadCountFromUser(user.getId());
                            unreadCount = unreadCount != null ? unreadCount : 0L;
                        } catch (Exception e) {
                            logger.error("Error getting unread count for user {}: {}", user.getId(), e.getMessage());
                            unreadCount = 0L;
                        }
                        return Map.of(
                                "id", (Object) user.getId(),
                                "username", user.getUsername(),
                                "fullName", user.getFullName() != null ? user.getFullName() : "",
                                "profileImage", user.getProfileImage() != null ? user.getProfileImage() : "",
                                "unreadCount", (Object) unreadCount
                        );
                    })
                    .collect(Collectors.toList());
            
            logger.debug("Returning {} conversation partners for {}", response.size(), username);
            return ResponseEntity.ok(response);
            
        } catch (SecurityException e) {
            logger.warn("Authentication error for {}: {}", username, e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Authentication required"));
                    
        } catch (Exception e) {
            logger.error("Error fetching conversation partners for {}: {}", username, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to load conversations"));
        }
    }
    
    @PatchMapping("/{messageId}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long messageId) {
        try {
            messageService.markAsRead(messageId);
            return ResponseEntity.ok(Map.of("success", true));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PatchMapping("/conversation/{userId}/read")
    public ResponseEntity<?> markConversationAsRead(@PathVariable Long userId) {
        try {
            messageService.markConversationAsRead(userId);
            return ResponseEntity.ok(Map.of("success", true));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/unread-count")
    public ResponseEntity<?> getUnreadCount() {
        try {
            Long count = messageService.getUnreadCount();
            return ResponseEntity.ok(Map.of("count", count));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
