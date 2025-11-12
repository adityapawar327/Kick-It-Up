package com.example.demo.dto;

import com.example.demo.model.Message;
import java.time.LocalDateTime;

public class MessageResponse {
    private Long id;
    private Long senderId;
    private String senderUsername;
    private Long receiverId;
    private String receiverUsername;
    private String content;
    private Long sneakerId;
    private String messageType;
    private String mediaUrl;
    private String mediaFileName;
    private String mediaMimeType;
    private Long mediaSize;
    private Boolean isRead;
    private LocalDateTime createdAt;

    public MessageResponse(Message message) {
        this.id = message.getId();
        this.senderId = message.getSender().getId();
        this.senderUsername = message.getSender().getUsername();
        this.receiverId = message.getReceiver().getId();
        this.receiverUsername = message.getReceiver().getUsername();
        this.content = message.getContent();
        this.sneakerId = message.getSneaker() != null ? message.getSneaker().getId() : null;
        this.messageType = message.getMessageType() != null ? message.getMessageType() : "TEXT";
        this.mediaUrl = message.getMediaUrl();
        this.mediaFileName = message.getMediaFileName();
        this.mediaMimeType = message.getMediaMimeType();
        this.mediaSize = message.getMediaSize();
        this.isRead = message.getIsRead();
        this.createdAt = message.getCreatedAt();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getSenderId() { return senderId; }
    public void setSenderId(Long senderId) { this.senderId = senderId; }

    public String getSenderUsername() { return senderUsername; }
    public void setSenderUsername(String senderUsername) { this.senderUsername = senderUsername; }

    public Long getReceiverId() { return receiverId; }
    public void setReceiverId(Long receiverId) { this.receiverId = receiverId; }

    public String getReceiverUsername() { return receiverUsername; }
    public void setReceiverUsername(String receiverUsername) { this.receiverUsername = receiverUsername; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public Long getSneakerId() { return sneakerId; }
    public void setSneakerId(Long sneakerId) { this.sneakerId = sneakerId; }

    public Boolean getIsRead() { return isRead; }
    public void setIsRead(Boolean isRead) { this.isRead = isRead; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getMessageType() { return messageType; }
    public void setMessageType(String messageType) { this.messageType = messageType; }

    public String getMediaUrl() { return mediaUrl; }
    public void setMediaUrl(String mediaUrl) { this.mediaUrl = mediaUrl; }

    public String getMediaFileName() { return mediaFileName; }
    public void setMediaFileName(String mediaFileName) { this.mediaFileName = mediaFileName; }

    public String getMediaMimeType() { return mediaMimeType; }
    public void setMediaMimeType(String mediaMimeType) { this.mediaMimeType = mediaMimeType; }

    public Long getMediaSize() { return mediaSize; }
    public void setMediaSize(Long mediaSize) { this.mediaSize = mediaSize; }
}
