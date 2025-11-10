package com.example.demo.controller;

import com.example.demo.dto.DashboardStats;
import com.example.demo.model.Order;
import com.example.demo.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/seller/stats")
    public ResponseEntity<DashboardStats> getSellerDashboard() {
        return ResponseEntity.ok(dashboardService.getSellerDashboard());
    }

    @GetMapping("/seller/orders")
    public ResponseEntity<?> getSellerOrders() {
        try {
            List<Order> orders = dashboardService.getSellerOrders();
            List<com.example.demo.dto.OrderResponse> response = orders.stream()
                    .map(com.example.demo.dto.OrderResponse::new)
                    .toList();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", e.getMessage()));
        }
    }
}
