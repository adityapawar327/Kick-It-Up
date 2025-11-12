package com.example.demo.repository;

import com.example.demo.model.Message;
import com.example.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    
    @Query("SELECT m FROM Message m WHERE (m.sender = :user OR m.receiver = :user) ORDER BY m.createdAt DESC")
    List<Message> findByUser(User user);
    
    @Query("SELECT m FROM Message m WHERE (m.sender = :user1 AND m.receiver = :user2) OR (m.sender = :user2 AND m.receiver = :user1) ORDER BY m.createdAt ASC")
    List<Message> findConversation(User user1, User user2);
    
    @Query("SELECT COUNT(m) FROM Message m WHERE m.receiver = :user AND m.isRead = false")
    Long countUnreadMessages(User user);
    
    @Query("SELECT COUNT(m) FROM Message m WHERE m.receiver = :receiver AND m.sender = :sender AND m.isRead = false")
    Long countUnreadMessagesFromUser(User receiver, User sender);
    
    @Query("SELECT m FROM Message m WHERE m.sender = :user OR m.receiver = :user ORDER BY m.createdAt DESC")
    List<Message> findAllUserMessages(User user);
    
    @Query("SELECT COUNT(m) FROM Message m WHERE m.sender = :sender AND m.createdAt >= :since")
    long countRecentMessagesBySender(User sender, java.time.LocalDateTime since);
}
