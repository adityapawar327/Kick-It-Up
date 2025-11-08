package com.example.demo.dto;

import java.math.BigDecimal;

public class DashboardStats {
    private Long totalListings;
    private Long activeSneakers;
    private Long soldSneakers;
    private Long totalOrders;
    private Long pendingOrders;
    private BigDecimal totalRevenue;

    public DashboardStats() {}

    public DashboardStats(Long totalListings, Long activeSneakers, Long soldSneakers, 
                         Long totalOrders, Long pendingOrders, BigDecimal totalRevenue) {
        this.totalListings = totalListings;
        this.activeSneakers = activeSneakers;
        this.soldSneakers = soldSneakers;
        this.totalOrders = totalOrders;
        this.pendingOrders = pendingOrders;
        this.totalRevenue = totalRevenue;
    }

    public Long getTotalListings() { return totalListings; }
    public void setTotalListings(Long totalListings) { this.totalListings = totalListings; }

    public Long getActiveSneakers() { return activeSneakers; }
    public void setActiveSneakers(Long activeSneakers) { this.activeSneakers = activeSneakers; }

    public Long getSoldSneakers() { return soldSneakers; }
    public void setSoldSneakers(Long soldSneakers) { this.soldSneakers = soldSneakers; }

    public Long getTotalOrders() { return totalOrders; }
    public void setTotalOrders(Long totalOrders) { this.totalOrders = totalOrders; }

    public Long getPendingOrders() { return pendingOrders; }
    public void setPendingOrders(Long pendingOrders) { this.pendingOrders = pendingOrders; }

    public BigDecimal getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }
}
