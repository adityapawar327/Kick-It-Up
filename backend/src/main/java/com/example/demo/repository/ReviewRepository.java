package com.example.demo.repository;

import com.example.demo.model.Review;
import com.example.demo.model.Sneaker;
import com.example.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findBySneaker(Sneaker sneaker);
    List<Review> findByUser(User user);
    Optional<Review> findBySneakerAndUser(Sneaker sneaker, User user);
    
    @Query("SELECT r FROM Review r " +
           "LEFT JOIN FETCH r.user " +
           "WHERE r.sneaker = :sneaker " +
           "ORDER BY r.createdAt DESC")
    List<Review> findBySneakerWithUser(@Param("sneaker") Sneaker sneaker);
}
