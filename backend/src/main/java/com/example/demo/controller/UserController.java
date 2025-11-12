package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.Set;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @Autowired
    private UserRepository userRepository;
    
    // Security: Pattern to detect SQL injection attempts
    private static final Pattern SQL_INJECTION_PATTERN = Pattern.compile(
        "('.*(--|;|/\\*|\\*/|xp_|sp_|exec|execute|select|insert|update|delete|drop|create|alter|union).*')|" +
        "(\\b(select|insert|update|delete|drop|create|alter|union|exec|execute)\\b)",
        Pattern.CASE_INSENSITIVE
    );
    
    // Security: Pattern for valid username format
    private static final Pattern VALID_USERNAME_PATTERN = Pattern.compile("^[a-zA-Z0-9_-]{2,50}$");
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        try {
            // Validate input
            if (id == null || id <= 0) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid user ID"));
            }
            
            // Security: Verify authenticated user
            String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
            if (currentUsername == null || currentUsername.trim().isEmpty()) {
                return ResponseEntity.status(401).body(Map.of("error", "Authentication required"));
            }
            
            // Get user
            User user = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            // Return only safe, public user information
            return ResponseEntity.ok(Map.of(
                    "id", user.getId(),
                    "username", sanitizeOutput(user.getUsername()),
                    "fullName", sanitizeOutput(user.getFullName() != null ? user.getFullName() : ""),
                    "profileImage", sanitizeOutput(user.getProfileImage() != null ? user.getProfileImage() : "")
            ));
        } catch (RuntimeException e) {
            if (e.getMessage().contains("not found")) {
                return ResponseEntity.status(404).body(Map.of("error", "User not found"));
            }
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid request"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Internal server error"));
        }
    }
    
    @GetMapping("/search")
    public ResponseEntity<?> searchUser(@RequestParam String username) {
        try {
            // Validate input
            if (username == null || username.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Username is required"));
            }
            
            String sanitizedUsername = username.trim();
            
            // Length validation
            if (sanitizedUsername.length() < 2) {
                return ResponseEntity.badRequest().body(Map.of("error", "Username must be at least 2 characters"));
            }
            
            if (sanitizedUsername.length() > 50) {
                return ResponseEntity.badRequest().body(Map.of("error", "Username is too long"));
            }
            
            // Security: Check for SQL injection attempts
            if (SQL_INJECTION_PATTERN.matcher(sanitizedUsername).find()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid username format"));
            }
            
            // Security: Validate username format
            if (!VALID_USERNAME_PATTERN.matcher(sanitizedUsername).matches()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Username contains invalid characters"));
            }
            
            // Get current user to prevent self-messaging
            String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
            if (currentUsername == null || currentUsername.trim().isEmpty()) {
                return ResponseEntity.status(401).body(Map.of("error", "Authentication required"));
            }
            
            if (sanitizedUsername.equalsIgnoreCase(currentUsername)) {
                return ResponseEntity.badRequest().body(Map.of("error", "You cannot message yourself"));
            }
            
            // Search for user
            User user = userRepository.findByUsername(sanitizedUsername)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            // Return only safe, public user information
            return ResponseEntity.ok(Map.of(
                    "id", user.getId(),
                    "username", sanitizeOutput(user.getUsername()),
                    "fullName", sanitizeOutput(user.getFullName() != null ? user.getFullName() : ""),
                    "profileImage", sanitizeOutput(user.getProfileImage() != null ? user.getProfileImage() : "")
            ));
        } catch (RuntimeException e) {
            if (e.getMessage().contains("not found")) {
                return ResponseEntity.status(404).body(Map.of("error", "User not found"));
            }
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid request"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Internal server error"));
        }
    }
    
    /**
     * Sanitize output to prevent XSS attacks
     */
    private String sanitizeOutput(String input) {
        if (input == null) {
            return "";
        }
        // Remove any HTML tags and potentially dangerous characters
        return input.replaceAll("<[^>]*>", "")
                    .replaceAll("[<>\"']", "")
                    .trim();
    }
    
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            return ResponseEntity.ok(Map.of(
                    "id", user.getId(),
                    "username", user.getUsername(),
                    "fullName", user.getFullName() != null ? user.getFullName() : "",
                    "email", user.getEmail() != null ? user.getEmail() : "",
                    "profileImage", user.getProfileImage() != null ? user.getProfileImage() : "",
                    "roles", user.getRoles() != null ? user.getRoles() : Set.of("USER")
            ));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", "Authentication required"));
        }
    }
}
