package com.example.demo.dto;

import jakarta.validation.constraints.*;

public class ReviewRequest {
    @NotNull(message = "Sneaker ID is required")
    private Long sneakerId;

    @NotNull(message = "Rating is required")
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must be at most 5")
    private Integer rating;

    @Size(max = 1000, message = "Comment must not exceed 1000 characters")
    private String comment;

    public Long getSneakerId() { return sneakerId; }
    public void setSneakerId(Long sneakerId) { this.sneakerId = sneakerId; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
}
