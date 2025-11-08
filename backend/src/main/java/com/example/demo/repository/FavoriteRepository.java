package com.example.demo.repository;

import com.example.demo.model.Favorite;
import com.example.demo.model.Sneaker;
import com.example.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    List<Favorite> findByUser(User user);
    
    @Query("SELECT f FROM Favorite f " +
           "LEFT JOIN FETCH f.sneaker s " +
           "LEFT JOIN FETCH s.seller " +
           "WHERE f.user = :user")
    List<Favorite> findByUserWithSneaker(@Param("user") User user);
    
    Optional<Favorite> findByUserAndSneaker(User user, Sneaker sneaker);
    boolean existsByUserAndSneaker(User user, Sneaker sneaker);
    void deleteByUserAndSneaker(User user, Sneaker sneaker);
}
