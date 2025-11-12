package com.example.demo.service;

import com.example.demo.dto.OrderRequest;
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
import java.util.List;

@Service
@Transactional
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private SneakerRepository sneakerRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public Order createOrder(OrderRequest request) {
        // Validate request
        if (request == null) {
            throw new IllegalArgumentException("Order request cannot be null");
        }
        if (request.getSneakerId() == null) {
            throw new IllegalArgumentException("Sneaker ID is required");
        }
        if (request.getShippingAddress() == null || request.getShippingAddress().trim().isEmpty()) {
            throw new IllegalArgumentException("Shipping address is required");
        }
        if (request.getPhoneNumber() == null || request.getPhoneNumber().trim().isEmpty()) {
            throw new IllegalArgumentException("Phone number is required");
        }
        
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User buyer = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Sneaker sneaker = sneakerRepository.findByIdWithSeller(request.getSneakerId())
                .orElseThrow(() -> new RuntimeException("Sneaker not found"));

        // Validate seller exists
        if (sneaker.getSeller() == null) {
            throw new RuntimeException("Sneaker has no seller");
        }
        
        // Prevent buying own sneakers
        if (sneaker.getSeller().getId().equals(buyer.getId())) {
            throw new RuntimeException("You cannot buy your own sneakers");
        }

        // Validate availability
        if (sneaker.getStatus() != Sneaker.SneakerStatus.AVAILABLE) {
            throw new RuntimeException("Sneaker is not available for purchase");
        }

        if (sneaker.getStock() == null || sneaker.getStock() < 1) {
            throw new RuntimeException("Sneaker is out of stock");
        }
        
        // Validate price
        if (sneaker.getPrice() == null || sneaker.getPrice().compareTo(java.math.BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Invalid sneaker price");
        }

        // Create order
        Order order = new Order();
        order.setBuyer(buyer);
        order.setSneaker(sneaker);
        order.setSeller(sneaker.getSeller());
        order.setTotalAmount(sneaker.getPrice());
        order.setShippingAddress(request.getShippingAddress().trim());
        order.setPhoneNumber(request.getPhoneNumber().trim());
        order.setStatus(Order.OrderStatus.PENDING);

        // Update stock atomically
        sneaker.setStock(sneaker.getStock() - 1);
        if (sneaker.getStock() == 0) {
            sneaker.setStatus(Sneaker.SneakerStatus.SOLD);
        }
        sneakerRepository.save(sneaker);

        return orderRepository.save(order);
    }

    @Transactional(readOnly = true)
    public List<Order> getMyOrders() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User buyer = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<Order> orders = orderRepository.findByBuyerWithDetails(buyer);
        // Force load lazy relationships
        orders.forEach(order -> {
            order.getSneaker().getName();
            order.getSeller().getUsername();
            order.getBuyer().getUsername();
        });
        return orders;
    }

    public Order getOrderById(Long id) {
        if (id == null) {
            throw new RuntimeException("Order ID cannot be null");
        }
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    public Order updateOrderStatus(Long id, Order.OrderStatus status) {
        if (id == null) {
            throw new RuntimeException("Order ID cannot be null");
        }
        Order order = getOrderById(id);
        order.setStatus(status);
        return orderRepository.save(order);
    }
}
