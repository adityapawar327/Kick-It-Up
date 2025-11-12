package com.example.demo.controller;

import com.example.demo.dto.TradeRequest;
import com.example.demo.model.Trade;
import com.example.demo.service.TradeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/trades")
public class TradeController {
    
    @Autowired
    private TradeService tradeService;
    
    @PostMapping
    public ResponseEntity<?> createTrade(@Valid @RequestBody TradeRequest request) {
        try {
            Trade trade = tradeService.createTrade(request);
            return ResponseEntity.ok(trade);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/received")
    public ResponseEntity<List<Trade>> getReceivedTrades() {
        return ResponseEntity.ok(tradeService.getReceivedTrades());
    }
    
    @GetMapping("/sent")
    public ResponseEntity<List<Trade>> getSentTrades() {
        return ResponseEntity.ok(tradeService.getSentTrades());
    }
    
    @PatchMapping("/{id}/accept")
    public ResponseEntity<?> acceptTrade(@PathVariable Long id) {
        try {
            Trade trade = tradeService.acceptTrade(id);
            return ResponseEntity.ok(trade);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PatchMapping("/{id}/decline")
    public ResponseEntity<?> declineTrade(@PathVariable Long id) {
        try {
            Trade trade = tradeService.declineTrade(id);
            return ResponseEntity.ok(trade);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
