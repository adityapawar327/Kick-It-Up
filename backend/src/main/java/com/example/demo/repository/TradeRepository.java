package com.example.demo.repository;

import com.example.demo.model.Trade;
import com.example.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TradeRepository extends JpaRepository<Trade, Long> {
    
    @Query("SELECT t FROM Trade t " +
           "LEFT JOIN FETCH t.requester " +
           "LEFT JOIN FETCH t.owner " +
           "LEFT JOIN FETCH t.offeredSneaker " +
           "LEFT JOIN FETCH t.requestedSneaker " +
           "WHERE t.owner = ?1 " +
           "ORDER BY t.createdAt DESC")
    List<Trade> findByOwnerWithDetails(User owner);
    
    @Query("SELECT t FROM Trade t " +
           "LEFT JOIN FETCH t.requester " +
           "LEFT JOIN FETCH t.owner " +
           "LEFT JOIN FETCH t.offeredSneaker " +
           "LEFT JOIN FETCH t.requestedSneaker " +
           "WHERE t.requester = ?1 " +
           "ORDER BY t.createdAt DESC")
    List<Trade> findByRequesterWithDetails(User requester);
}
