package com.example.demo.service;

import com.example.demo.dto.TradeRequest;
import com.example.demo.model.Sneaker;
import com.example.demo.model.Trade;
import com.example.demo.model.User;
import com.example.demo.repository.SneakerRepository;
import com.example.demo.repository.TradeRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional
public class TradeService {
    
    @Autowired
    private TradeRepository tradeRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private SneakerRepository sneakerRepository;
    
    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
    
    @Transactional
    public Trade createTrade(TradeRequest request) {
        // Validate request
        if (request == null) {
            throw new IllegalArgumentException("Trade request cannot be null");
        }
        if (request.getOfferedSneakerId() == null) {
            throw new IllegalArgumentException("Offered sneaker ID is required");
        }
        if (request.getRequestedSneakerId() == null) {
            throw new IllegalArgumentException("Requested sneaker ID is required");
        }
        if (request.getOfferedSneakerId().equals(request.getRequestedSneakerId())) {
            throw new IllegalArgumentException("Cannot trade a sneaker for itself");
        }
        
        User requester = getCurrentUser();
        
        // Fetch sneakers with proper error handling
        Sneaker offeredSneaker = sneakerRepository.findByIdWithSeller(request.getOfferedSneakerId())
                .orElseThrow(() -> new RuntimeException("Offered sneaker not found"));
        
        Sneaker requestedSneaker = sneakerRepository.findByIdWithSeller(request.getRequestedSneakerId())
                .orElseThrow(() -> new RuntimeException("Requested sneaker not found"));
        
        // Validate ownership
        if (offeredSneaker.getSeller() == null || offeredSneaker.getSeller().getId() == null) {
            throw new RuntimeException("Offered sneaker has no valid seller");
        }
        if (!offeredSneaker.getSeller().getId().equals(requester.getId())) {
            throw new RuntimeException("You can only offer your own sneakers");
        }
        
        if (requestedSneaker.getSeller() == null || requestedSneaker.getSeller().getId() == null) {
            throw new RuntimeException("Requested sneaker has no valid seller");
        }
        if (requestedSneaker.getSeller().getId().equals(requester.getId())) {
            throw new RuntimeException("You cannot trade with yourself");
        }
        
        // Validate availability based on stock
        if (offeredSneaker.getStock() == null || offeredSneaker.getStock() <= 0) {
            throw new RuntimeException("Offered sneaker is not available (out of stock)");
        }
        
        if (requestedSneaker.getStock() == null || requestedSneaker.getStock() <= 0) {
            throw new RuntimeException("Requested sneaker is not available (out of stock)");
        }
        
        // Check for duplicate pending trades
        List<Trade> existingTrades = tradeRepository.findByRequesterWithDetails(requester);
        boolean duplicateExists = existingTrades.stream()
                .anyMatch(t -> t.getStatus() == Trade.TradeStatus.PENDING &&
                        t.getOfferedSneaker().getId().equals(request.getOfferedSneakerId()) &&
                        t.getRequestedSneaker().getId().equals(request.getRequestedSneakerId()));
        if (duplicateExists) {
            throw new RuntimeException("You already have a pending trade request for these sneakers");
        }
        
        // Sanitize message
        String sanitizedMessage = request.getMessage() != null ? 
                request.getMessage().trim().substring(0, Math.min(request.getMessage().trim().length(), 500)) : "";
        
        // Create trade
        Trade trade = new Trade();
        trade.setRequester(requester);
        trade.setOwner(requestedSneaker.getSeller());
        trade.setOfferedSneaker(offeredSneaker);
        trade.setRequestedSneaker(requestedSneaker);
        trade.setMessage(sanitizedMessage);
        trade.setStatus(Trade.TradeStatus.PENDING);
        
        return tradeRepository.save(trade);
    }
    
    @Transactional(readOnly = true)
    public List<Trade> getReceivedTrades() {
        User currentUser = getCurrentUser();
        return tradeRepository.findByOwnerWithDetails(currentUser);
    }
    
    @Transactional(readOnly = true)
    public List<Trade> getSentTrades() {
        User currentUser = getCurrentUser();
        return tradeRepository.findByRequesterWithDetails(currentUser);
    }
    
    @Transactional
    public Trade acceptTrade(Long tradeId) {
        if (tradeId == null) {
            throw new IllegalArgumentException("Trade ID cannot be null");
        }
        
        User currentUser = getCurrentUser();
        Trade trade = tradeRepository.findById(tradeId)
                .orElseThrow(() -> new RuntimeException("Trade not found"));
        
        // Validate ownership
        if (trade.getOwner() == null || trade.getOwner().getId() == null) {
            throw new RuntimeException("Trade has no valid owner");
        }
        if (!trade.getOwner().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You can only accept trades sent to you");
        }
        
        if (trade.getStatus() != Trade.TradeStatus.PENDING) {
            throw new RuntimeException("Trade is no longer pending");
        }
        
        // Re-validate stock availability before accepting
        Sneaker offeredSneaker = sneakerRepository.findById(trade.getOfferedSneaker().getId())
                .orElseThrow(() -> new RuntimeException("Offered sneaker no longer exists"));
        Sneaker requestedSneaker = sneakerRepository.findById(trade.getRequestedSneaker().getId())
                .orElseThrow(() -> new RuntimeException("Requested sneaker no longer exists"));
        
        if (offeredSneaker.getStock() == null || offeredSneaker.getStock() <= 0) {
            trade.setStatus(Trade.TradeStatus.DECLINED);
            tradeRepository.save(trade);
            throw new RuntimeException("Offered sneaker is no longer available");
        }
        
        if (requestedSneaker.getStock() == null || requestedSneaker.getStock() <= 0) {
            trade.setStatus(Trade.TradeStatus.DECLINED);
            tradeRepository.save(trade);
            throw new RuntimeException("Your sneaker is no longer available");
        }
        
        trade.setStatus(Trade.TradeStatus.ACCEPTED);
        return tradeRepository.save(trade);
    }
    
    @Transactional
    public Trade declineTrade(Long tradeId) {
        if (tradeId == null) {
            throw new IllegalArgumentException("Trade ID cannot be null");
        }
        
        User currentUser = getCurrentUser();
        Trade trade = tradeRepository.findById(tradeId)
                .orElseThrow(() -> new RuntimeException("Trade not found"));
        
        // Validate ownership
        if (trade.getOwner() == null || trade.getOwner().getId() == null) {
            throw new RuntimeException("Trade has no valid owner");
        }
        if (!trade.getOwner().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You can only decline trades sent to you");
        }
        
        if (trade.getStatus() != Trade.TradeStatus.PENDING) {
            throw new RuntimeException("Trade is no longer pending");
        }
        
        trade.setStatus(Trade.TradeStatus.DECLINED);
        return tradeRepository.save(trade);
    }
}
