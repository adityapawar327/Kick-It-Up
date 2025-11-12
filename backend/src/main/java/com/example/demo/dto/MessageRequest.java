package com.example.demo.dto;

public class MessageRequest {
    private Long receiverId;
    private String content;
    private Long sneakerId;
    private String messageType; // TEXT, IMAGE, VIDEO, AUDIO
    private String mediaUrl;
    private String mediaFileName;
    private String mediaMimeType;
    private Long mediaSize;

    // Getters and Setters
    public Long getReceiverId() { return receiverId; }
    public void setReceiverId(Long receiverId) { this.receiverId = receiverId; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public Long getSneakerId() { return sneakerId; }
    public void setSneakerId(Long sneakerId) { this.sneakerId = sneakerId; }

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
