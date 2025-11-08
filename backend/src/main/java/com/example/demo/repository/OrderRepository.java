package com.example.demo.repository;

import com.example.demo.model.Order;
import com.example.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByBuyer(User buyer);
    List<Order> findByStatus(Order.OrderStatus status);
    
    @Query("SELECT o FROM Order o " +
           "LEFT JOIN FETCH o.sneaker s " +
           "LEFT JOIN FETCH o.seller " +
           "LEFT JOIN FETCH o.buyer " +
           "WHERE o.buyer = :buyer " +
           "ORDER BY o.orderDate DESC")
    List<Order> findByBuyerWithDetails(@Param("buyer") User buyer);
}
