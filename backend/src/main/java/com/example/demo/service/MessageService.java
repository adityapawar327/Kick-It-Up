package com.example.demo.service;

import com.example.demo.dto.MessageRequest;
import com.example.demo.model.Message;
import com.example.demo.model.Sneaker;
import com.example.demo.model.User;
import com.example.demo.repository.MessageRepository;
import com.example.demo.repository.SneakerRepository;
import com.example.demo.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.regex.Pattern;

@Service
@Transactional
public class MessageService {
    
    private static final Logger logger = LoggerFactory.getLogger(MessageService.class);
    
    @Autowired
    private MessageRepository messageRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private SneakerRepository sneakerRepository;
    
    // Rate limiting constants
    private static final int MAX_MESSAGES_PER_MINUTE = 10;
    private static final int MAX_MESSAGE_LENGTH = 1000;
    private static final int MIN_MESSAGE_LENGTH = 1;
    
    // SQL Injection protection - Pattern for suspicious content
    private static final Pattern SQL_INJECTION_PATTERN = Pattern.compile(
        "('.*(--|;|/\\*|\\*/|xp_|sp_|exec|execute|select|insert|update|delete|drop|create|alter|union).*')|" +
        "(\\b(select|insert|update|delete|drop|create|alter|union|exec|execute)\\b)",
        Pattern.CASE_INSENSITIVE
    );
    
    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        if (username == null || username.trim().isEmpty()) {
            throw new SecurityException("Invalid authentication context");
        }
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new SecurityException("User not found or session expired"));
    }
    
    /**
     * Sanitize message content to prevent XSS attacks
     */
    private String sanitizeContent(String content) {
        if (content == null) {
            return "";
        }
        
        // Remove any HTML tags
        String sanitized = content.replaceAll("<[^>]*>", "");
        
        // Remove script tags and their content
        sanitized = sanitized.replaceAll("(?i)<script[^>]*>.*?</script>", "");
        
        // Remove potentially dangerous characters
        sanitized = sanitized.replaceAll("[<>\"']", "");
        
        // Remove control characters except newlines, tabs, and carriage returns
        sanitized = sanitized.replaceAll("[\\p{Cntrl}&&[^\n\t\r]]", "");
        
        // Normalize whitespace
        sanitized = sanitized.trim().replaceAll("\\s+", " ");
        
        return sanitized;
    }
    
    /**
     * Validate message content for security threats
     */
    private void validateMessageContent(String content) {
        if (content == null || content.trim().isEmpty()) {
            throw new IllegalArgumentException("Message content cannot be empty");
        }
        
        if (content.length() < MIN_MESSAGE_LENGTH) {
            throw new IllegalArgumentException("Message is too short");
        }
        
        if (content.length() > MAX_MESSAGE_LENGTH) {
            throw new IllegalArgumentException("Message exceeds maximum length of " + MAX_MESSAGE_LENGTH + " characters");
        }
        
        // Check for SQL injection attempts
        if (SQL_INJECTION_PATTERN.matcher(content).find()) {
            throw new SecurityException("Message contains prohibited content");
        }
        
        // Check for excessive special characters (potential attack)
        long specialCharCount = content.chars()
                .filter(ch -> !Character.isLetterOrDigit(ch) && !Character.isWhitespace(ch))
                .count();
        
        if (specialCharCount > content.length() * 0.5) {
            throw new IllegalArgumentException("Message contains too many special characters");
        }
    }
    
    /**
     * Verify user has permission to access another user's data
     */
    private void verifyUserAccess(User currentUser, Long targetUserId) {
        if (currentUser == null) {
            throw new SecurityException("Authentication required");
        }
        
        if (targetUserId == null) {
            throw new IllegalArgumentException("Target user ID is required");
        }
        
        // Verify target user exists
        if (!userRepository.existsById(targetUserId)) {
            throw new IllegalArgumentException("Target user not found");
        }
    }
    
    @Transactional
    public Message sendMessage(MessageRequest request) {
        // Validate request object
        if (request == null) {
            throw new IllegalArgumentException("Message request cannot be null");
        }
        
        // Get authenticated user
        User sender = getCurrentUser();
        
        // Validate receiver ID
        if (request.getReceiverId() == null) {
            throw new IllegalArgumentException("Receiver ID is required");
        }
        
        // Verify receiver exists and get receiver
        User receiver = userRepository.findById(request.getReceiverId())
                .orElseThrow(() -> new IllegalArgumentException("Receiver not found"));
        
        // Security: Prevent sending message to self
        if (sender.getId().equals(receiver.getId())) {
            throw new SecurityException("Cannot send message to yourself");
        }
        
        // Determine message type
        String messageType = request.getMessageType() != null ? request.getMessageType() : "TEXT";
        
        // Validate based on message type
        if ("TEXT".equals(messageType)) {
            // Validate and sanitize text message content
            validateMessageContent(request.getContent());
            String sanitizedContent = sanitizeContent(request.getContent());
            
            // Additional validation after sanitization
            if (sanitizedContent.isEmpty()) {
                throw new IllegalArgumentException("Message content is empty after sanitization");
            }
            request.setContent(sanitizedContent);
        } else {
            // For media messages, validate media URL
            if (request.getMediaUrl() == null || request.getMediaUrl().trim().isEmpty()) {
                throw new IllegalArgumentException("Media URL is required for " + messageType + " messages");
            }
            
            // Optional: Set content to media description or empty
            if (request.getContent() == null) {
                request.setContent("");
            }
        }
        
        // Rate limiting check - count recent messages from sender
        long recentMessageCount = messageRepository.countRecentMessagesBySender(
            sender, 
            java.time.LocalDateTime.now().minusMinutes(1)
        );
        
        if (recentMessageCount >= MAX_MESSAGES_PER_MINUTE) {
            logger.warn("Rate limit exceeded for user {}: {} messages in last minute", 
                       sender.getUsername(), recentMessageCount);
            throw new SecurityException("Rate limit exceeded. Please wait before sending more messages.");
        }
        
        // Create and save message
        Message message = new Message();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setContent(request.getContent());
        message.setMessageType(messageType);
        message.setMediaUrl(request.getMediaUrl());
        message.setMediaFileName(request.getMediaFileName());
        message.setMediaMimeType(request.getMediaMimeType());
        message.setMediaSize(request.getMediaSize());
        message.setIsRead(false);
        
        // Optional: Link to sneaker with validation
        if (request.getSneakerId() != null) {
            Sneaker sneaker = sneakerRepository.findById(request.getSneakerId())
                    .orElse(null);
            
            // Verify sneaker exists and is accessible
            if (sneaker != null) {
                message.setSneaker(sneaker);
            }
        }
        
        try {
            return messageRepository.save(message);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send message. Please try again.", e);
        }
    }
    
    @Transactional(readOnly = true)
    public List<Message> getConversation(Long otherUserId) {
        // Validate input
        if (otherUserId == null) {
            throw new IllegalArgumentException("User ID is required");
        }
        
        // Get authenticated user
        User currentUser = getCurrentUser();
        
        // Verify access to target user
        verifyUserAccess(currentUser, otherUserId);
        
        // Get other user
        User otherUser = userRepository.findById(otherUserId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        // Security: Prevent accessing conversation with self
        if (currentUser.getId().equals(otherUser.getId())) {
            throw new SecurityException("Cannot view conversation with yourself");
        }
        
        try {
            return messageRepository.findConversation(currentUser, otherUser);
        } catch (Exception e) {
            throw new RuntimeException("Failed to retrieve conversation", e);
        }
    }
    
    @Transactional(readOnly = true)
    public List<User> getConversationPartners() {
        try {
            User currentUser = getCurrentUser();
            if (currentUser == null) {
                throw new RuntimeException("Current user not found");
            }
            
            // Get all messages involving the current user
            List<Message> messages = messageRepository.findAllUserMessages(currentUser);
            
            // Extract unique conversation partners
            List<User> partners = messages.stream()
                    .map(m -> m.getSender().getId().equals(currentUser.getId()) 
                            ? m.getReceiver() 
                            : m.getSender())
                    .distinct()
                    .toList();
            
            return partners;
        } catch (Exception e) {
            System.err.println("Error getting conversation partners: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
    
    @Transactional
    public void markAsRead(Long messageId) {
        // Validate input
        if (messageId == null) {
            throw new IllegalArgumentException("Message ID is required");
        }
        
        // Get authenticated user
        User currentUser = getCurrentUser();
        
        // Get message
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new IllegalArgumentException("Message not found"));
        
        // Security: Only receiver can mark message as read
        if (!message.getReceiver().getId().equals(currentUser.getId())) {
            throw new SecurityException("Unauthorized: You can only mark your own messages as read");
        }
        
        // Idempotent operation - only update if not already read
        if (!message.getIsRead()) {
            message.setIsRead(true);
            try {
                messageRepository.save(message);
            } catch (Exception e) {
                throw new RuntimeException("Failed to mark message as read", e);
            }
        }
    }
    
    @Transactional
    public void markConversationAsRead(Long otherUserId) {
        // Validate input
        if (otherUserId == null) {
            throw new IllegalArgumentException("User ID is required");
        }
        
        // Get authenticated user
        User currentUser = getCurrentUser();
        
        // Verify access
        verifyUserAccess(currentUser, otherUserId);
        
        // Get other user
        User otherUser = userRepository.findById(otherUserId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        // Security: Prevent marking conversation with self
        if (currentUser.getId().equals(otherUser.getId())) {
            throw new SecurityException("Cannot mark conversation with yourself");
        }
        
        try {
            // Get conversation messages
            List<Message> messages = messageRepository.findConversation(currentUser, otherUser);
            
            // Only mark unread messages where current user is receiver
            List<Message> unreadMessages = messages.stream()
                    .filter(m -> m.getReceiver().getId().equals(currentUser.getId()) && !m.getIsRead())
                    .peek(m -> m.setIsRead(true))
                    .toList();
            
            // Batch update for efficiency
            if (!unreadMessages.isEmpty()) {
                messageRepository.saveAll(unreadMessages);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to mark conversation as read", e);
        }
    }
    
    @Transactional(readOnly = true)
    public Long getUnreadCount() {
        User currentUser = getCurrentUser();
        return messageRepository.countUnreadMessages(currentUser);
    }
    
    @Transactional(readOnly = true)
    public Long getUnreadCountFromUser(Long senderId) {
        if (senderId == null) {
            return Long.valueOf(0);
        }
        
        User currentUser = getCurrentUser();
        if (currentUser == null) {
            return Long.valueOf(0);
        }
        
        User sender = userRepository.findById(senderId).orElse(null);
        
        if (sender == null) {
            return Long.valueOf(0);
        }
        
        Long count = messageRepository.countUnreadMessagesFromUser(currentUser, sender);
        return count != null ? count : Long.valueOf(0);
    }
}
