package com.example.demo.service;

import com.example.demo.model.Order;
import com.example.demo.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderSchedulerService {

    @Autowired
    private OrderRepository orderRepository;

    // Run every hour to check for orders that need to be marked as delivered
    @Scheduled(fixedRate = 3600000) // 1 hour in milliseconds
    @Transactional
    public void autoCompleteOrders() {
        LocalDateTime threeDaysAgo = LocalDateTime.now().minusDays(3);
        
        // Find all PENDING and SHIPPED orders
        List<Order> pendingOrders = orderRepository.findByStatus(Order.OrderStatus.PENDING);
        List<Order> shippedOrders = orderRepository.findByStatus(Order.OrderStatus.SHIPPED);
        
        int updatedCount = 0;
        
        // Check PENDING orders
        for (Order order : pendingOrders) {
            if (order.getOrderDate().isBefore(threeDaysAgo)) {
                order.setStatus(Order.OrderStatus.DELIVERED);
                orderRepository.save(order);
                updatedCount++;
            }
        }
        
        // Check SHIPPED orders
        for (Order order : shippedOrders) {
            if (order.getOrderDate().isBefore(threeDaysAgo)) {
                order.setStatus(Order.OrderStatus.DELIVERED);
                orderRepository.save(order);
                updatedCount++;
            }
        }
        
        if (updatedCount > 0) {
            System.out.println("Auto-completed " + updatedCount + " orders older than 3 days");
        }
    }
}
