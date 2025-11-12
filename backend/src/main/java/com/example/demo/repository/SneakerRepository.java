package com.example.demo.repository;

import com.example.demo.model.Sneaker;
import com.example.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface SneakerRepository extends JpaRepository<Sneaker, Long> {
    @Query("SELECT s FROM Sneaker s JOIN FETCH s.seller WHERE s.stock > 0")
    List<Sneaker> findAllWithSeller();
    
    @Query("SELECT s FROM Sneaker s JOIN FETCH s.seller WHERE s.id = :id")
    Optional<Sneaker> findByIdWithSeller(Long id);
    
    @Query("SELECT s FROM Sneaker s JOIN FETCH s.seller WHERE s.seller = :seller")
    List<Sneaker> findBySellerWithSeller(User seller);
    
    List<Sneaker> findBySeller(User seller);
    List<Sneaker> findByStatus(Sneaker.SneakerStatus status);
    
    @Query("SELECT s FROM Sneaker s WHERE s.brand LIKE %:brand% AND s.stock > 0")
    List<Sneaker> findByBrandContainingIgnoreCase(String brand);
    
    @Query("SELECT s FROM Sneaker s WHERE s.name LIKE %:name% AND s.stock > 0")
    List<Sneaker> findByNameContainingIgnoreCase(String name);
}
