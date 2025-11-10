package com.example.demo.controller;

import com.example.demo.dto.SneakerRequest;
import com.example.demo.model.Sneaker;
import com.example.demo.service.SneakerService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/sneakers")
public class SneakerController {
    @Autowired
    private SneakerService sneakerService;

    @PostMapping
    public ResponseEntity<?> createSneaker(@Valid @RequestBody SneakerRequest request) {
        try {
            Sneaker sneaker = sneakerService.createSneaker(request);
            return ResponseEntity.ok(new com.example.demo.dto.SneakerResponse(sneaker));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllSneakers() {
        try {
            List<Sneaker> sneakers = sneakerService.getAllSneakers();
            List<com.example.demo.dto.SneakerResponse> response = sneakers.stream()
                    .map(com.example.demo.dto.SneakerResponse::new)
                    .toList();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/available")
    public ResponseEntity<?> getAvailableSneakers() {
        try {
            List<Sneaker> sneakers = sneakerService.getAvailableSneakers();
            List<com.example.demo.dto.SneakerResponse> response = sneakers.stream()
                    .map(com.example.demo.dto.SneakerResponse::new)
                    .toList();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getSneakerById(@PathVariable Long id) {
        try {
            Sneaker sneaker = sneakerService.getSneakerById(id);
            return ResponseEntity.ok(new com.example.demo.dto.SneakerResponse(sneaker));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/my-sneakers")
    public ResponseEntity<?> getMySneakers() {
        try {
            List<Sneaker> sneakers = sneakerService.getMySneakers();
            List<com.example.demo.dto.SneakerResponse> response = sneakers.stream()
                    .map(com.example.demo.dto.SneakerResponse::new)
                    .toList();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateSneaker(@PathVariable Long id, @Valid @RequestBody SneakerRequest request) {
        try {
            Sneaker sneaker = sneakerService.updateSneaker(id, request);
            return ResponseEntity.ok(new com.example.demo.dto.SneakerResponse(sneaker));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSneaker(@PathVariable Long id) {
        sneakerService.deleteSneaker(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search/brand")
    public ResponseEntity<?> searchByBrand(@RequestParam String brand) {
        try {
            List<Sneaker> sneakers = sneakerService.searchByBrand(brand);
            List<com.example.demo.dto.SneakerResponse> response = sneakers.stream()
                    .map(com.example.demo.dto.SneakerResponse::new)
                    .toList();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/search/name")
    public ResponseEntity<?> searchByName(@RequestParam String name) {
        try {
            List<Sneaker> sneakers = sneakerService.searchByName(name);
            List<com.example.demo.dto.SneakerResponse> response = sneakers.stream()
                    .map(com.example.demo.dto.SneakerResponse::new)
                    .toList();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", e.getMessage()));
        }
    }
}
