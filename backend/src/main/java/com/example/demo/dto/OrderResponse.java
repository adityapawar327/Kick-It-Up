package com.example.demo.dto;

import com.example.demo.model.Order;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class OrderResponse {
    private Long id;
    private Long sneakerId;
    private String sneakerName;
    private String buyerUsername;
    private String sellerUsername;
    private BigDecimal totalPrice;
    private String shippingAddress;
    private String phoneNumber;
    private String status;
    private LocalDateTime orderDate;

    public OrderResponse() {}

    public OrderResponse(Order order) {
        this.id = order.getId();
        this.sneakerId = order.getSneaker().getId();
        this.sneakerName = order.getSneaker().getName();
        this.buyerUsername = order.getBuyer().getUsername();
        this.sellerUsername = order.getSeller().getUsername();
        this.totalPrice = order.getTotalAmount();
        this.shippingAddress = order.getShippingAddress();
        this.phoneNumber = order.getPhoneNumber();
        this.status = order.getStatus().name();
        this.orderDate = order.getOrderDate();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getSneakerId() { return sneakerId; }
    public void setSneakerId(Long sneakerId) { this.sneakerId = sneakerId; }

    public String getSneakerName() { return sneakerName; }
    public void setSneakerName(String sneakerName) { this.sneakerName = sneakerName; }

    public String getBuyerUsername() { return buyerUsername; }
    public void setBuyerUsername(String buyerUsername) { this.buyerUsername = buyerUsername; }

    public String getSellerUsername() { return sellerUsername; }
    public void setSellerUsername(String sellerUsername) { this.sellerUsername = sellerUsername; }

    public BigDecimal getTotalPrice() { return totalPrice; }
    public void setTotalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; }

    public String getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getOrderDate() { return orderDate; }
    public void setOrderDate(LocalDateTime orderDate) { this.orderDate = orderDate; }
}
