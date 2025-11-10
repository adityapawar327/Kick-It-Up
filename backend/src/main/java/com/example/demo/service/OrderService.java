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
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User buyer = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Sneaker sneaker = sneakerRepository.findByIdWithSeller(request.getSneakerId())
                .orElseThrow(() -> new RuntimeException("Sneaker not found"));

        if (sneaker.getStatus() != Sneaker.SneakerStatus.AVAILABLE) {
            throw new RuntimeException("Sneaker is not available");
        }

        if (sneaker.getStock() < 1) {
            throw new RuntimeException("Sneaker is out of stock");
        }

        Order order = new Order();
        order.setBuyer(buyer);
        order.setSneaker(sneaker);
        order.setSeller(sneaker.getSeller());
        order.setTotalAmount(sneaker.getPrice());
        order.setShippingAddress(request.getShippingAddress());
        order.setPhoneNumber(request.getPhoneNumber());

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
