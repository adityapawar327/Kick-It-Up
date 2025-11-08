package com.example.demo.dto;

import com.example.demo.model.Sneaker;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class SneakerResponse {
    private Long id;
    private String name;
    private String brand;
    private String description;
    private BigDecimal price;
    private String size;
    private String color;
    private String condition;
    private Integer stock;
    private List<String> imageUrls;
    private String status;
    private LocalDateTime createdAt;
    private SellerInfo seller;
    private Double averageRating;

    public static class SellerInfo {
        private Long id;
        private String username;

        public SellerInfo(Long id, String username) {
            this.id = id;
            this.username = username;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
    }

    public SneakerResponse() {}

    public SneakerResponse(Sneaker sneaker) {
        this.id = sneaker.getId();
        this.name = sneaker.getName();
        this.brand = sneaker.getBrand();
        this.description = sneaker.getDescription();
        this.price = sneaker.getPrice();
        this.size = sneaker.getSize();
        this.color = sneaker.getColor();
        this.condition = sneaker.getCondition();
        this.stock = sneaker.getStock();
        this.imageUrls = sneaker.getImageUrls();
        this.status = sneaker.getStatus().name();
        this.createdAt = sneaker.getCreatedAt();
        if (sneaker.getSeller() != null) {
            this.seller = new SellerInfo(sneaker.getSeller().getId(), sneaker.getSeller().getUsername());
        }
        this.averageRating = 0.0; // Will be calculated separately if needed
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public String getSize() { return size; }
    public void setSize(String size) { this.size = size; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public String getCondition() { return condition; }
    public void setCondition(String condition) { this.condition = condition; }

    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }

    public List<String> getImageUrls() { return imageUrls; }
    public void setImageUrls(List<String> imageUrls) { this.imageUrls = imageUrls; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public SellerInfo getSeller() { return seller; }
    public void setSeller(SellerInfo seller) { this.seller = seller; }

    public Double getAverageRating() { return averageRating; }
    public void setAverageRating(Double averageRating) { this.averageRating = averageRating; }
}
