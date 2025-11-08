package com.example.demo.service;

import com.example.demo.dto.DashboardStats;
import com.example.demo.model.Order;
import com.example.demo.model.Sneaker;
import com.example.demo.model.User;
import com.example.demo.repository.OrderRepository;
import com.example.demo.repository.SneakerRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;

@Service
@Transactional
public class DashboardService {
    @Autowired
    private SneakerRepository sneakerRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    public DashboardStats getSellerDashboard() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User seller = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Sneaker> allSneakers = sneakerRepository.findBySeller(seller);
        long totalListings = allSneakers.size();
        long activeSneakers = allSneakers.stream()
                .filter(s -> s.getStatus() == Sneaker.SneakerStatus.AVAILABLE)
                .count();
        long soldSneakers = allSneakers.stream()
                .filter(s -> s.getStatus() == Sneaker.SneakerStatus.SOLD)
                .count();

        List<Order> allOrders = orderRepository.findAll().stream()
                .filter(o -> o.getSneaker().getSeller().getId().equals(seller.getId()))
                .toList();

        long totalOrders = allOrders.size();
        long pendingOrders = allOrders.stream()
                .filter(o -> o.getStatus() == Order.OrderStatus.PENDING)
                .count();

        BigDecimal totalRevenue = allOrders.stream()
                .filter(o -> o.getStatus() != Order.OrderStatus.CANCELLED)
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new DashboardStats(totalListings, activeSneakers, soldSneakers, 
                                 totalOrders, pendingOrders, totalRevenue);
    }

    public List<Order> getSellerOrders() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User seller = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return orderRepository.findAll().stream()
                .filter(o -> o.getSneaker().getSeller().getId().equals(seller.getId()))
                .toList();
    }
}
