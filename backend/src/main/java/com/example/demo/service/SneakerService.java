package com.example.demo.service;

import com.example.demo.dto.SneakerRequest;
import com.example.demo.model.Sneaker;
import com.example.demo.model.User;
import com.example.demo.repository.SneakerRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional
public class SneakerService {
    @Autowired
    private SneakerRepository sneakerRepository;

    @Autowired
    private UserRepository userRepository;

    public Sneaker createSneaker(SneakerRequest request) {
        // Validate request
        if (request == null) {
            throw new IllegalArgumentException("Sneaker request cannot be null");
        }
        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Sneaker name is required");
        }
        if (request.getBrand() == null || request.getBrand().trim().isEmpty()) {
            throw new IllegalArgumentException("Brand is required");
        }
        if (request.getPrice() == null || request.getPrice().compareTo(java.math.BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Price must be greater than 0");
        }
        if (request.getStock() == null || request.getStock() < 1) {
            throw new IllegalArgumentException("Stock must be at least 1");
        }
        if (request.getStock() > 10000) {
            throw new IllegalArgumentException("Stock cannot exceed 10,000");
        }
        if (request.getImageUrls() == null || request.getImageUrls().isEmpty()) {
            throw new IllegalArgumentException("At least one image is required");
        }
        
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User seller = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Sneaker sneaker = new Sneaker();
        sneaker.setName(request.getName().trim());
        sneaker.setBrand(request.getBrand().trim());
        sneaker.setDescription(request.getDescription() != null ? request.getDescription().trim() : "");
        sneaker.setPrice(request.getPrice());
        sneaker.setSize(request.getSize() != null ? request.getSize().trim() : "");
        sneaker.setColor(request.getColor() != null ? request.getColor().trim() : "");
        sneaker.setCondition(request.getCondition() != null ? request.getCondition().trim() : "NEW");
        sneaker.setStock(request.getStock());
        sneaker.setImageUrls(request.getImageUrls());
        sneaker.setSeller(seller);
        sneaker.setStatus(Sneaker.SneakerStatus.AVAILABLE);

        return sneakerRepository.save(sneaker);
    }

    public List<Sneaker> getAllSneakers() {
        return sneakerRepository.findAllWithSeller();
    }

    public List<Sneaker> getAvailableSneakers() {
        return sneakerRepository.findAllWithSeller();
    }

    public Sneaker getSneakerById(Long id) {
        return sneakerRepository.findByIdWithSeller(id)
                .orElseThrow(() -> new RuntimeException("Sneaker not found"));
    }

    public List<Sneaker> getMySneakers() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User seller = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return sneakerRepository.findBySellerWithSeller(seller);
    }

    public Sneaker updateSneaker(Long id, SneakerRequest request) {
        if (id == null) {
            throw new IllegalArgumentException("Sneaker ID cannot be null");
        }
        if (request == null) {
            throw new IllegalArgumentException("Sneaker request cannot be null");
        }
        
        Sneaker sneaker = getSneakerById(id);
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        if (sneaker.getSeller() == null || !sneaker.getSeller().getUsername().equals(username)) {
            throw new RuntimeException("You can only update your own sneakers");
        }

        // Validate updates
        if (request.getName() != null && !request.getName().trim().isEmpty()) {
            sneaker.setName(request.getName().trim());
        }
        if (request.getBrand() != null && !request.getBrand().trim().isEmpty()) {
            sneaker.setBrand(request.getBrand().trim());
        }
        if (request.getDescription() != null) {
            sneaker.setDescription(request.getDescription().trim());
        }
        if (request.getPrice() != null && request.getPrice().compareTo(java.math.BigDecimal.ZERO) > 0) {
            sneaker.setPrice(request.getPrice());
        }
        if (request.getSize() != null) {
            sneaker.setSize(request.getSize().trim());
        }
        if (request.getColor() != null) {
            sneaker.setColor(request.getColor().trim());
        }
        if (request.getCondition() != null) {
            sneaker.setCondition(request.getCondition().trim());
        }
        if (request.getStock() != null) {
            if (request.getStock() < 0) {
                throw new IllegalArgumentException("Stock cannot be negative");
            }
            if (request.getStock() > 10000) {
                throw new IllegalArgumentException("Stock cannot exceed 10,000");
            }
            sneaker.setStock(request.getStock());
            // Update status based on stock
            if (request.getStock() == 0) {
                sneaker.setStatus(Sneaker.SneakerStatus.SOLD);
            } else if (sneaker.getStatus() == Sneaker.SneakerStatus.SOLD) {
                sneaker.setStatus(Sneaker.SneakerStatus.AVAILABLE);
            }
        }
        if (request.getImageUrls() != null && !request.getImageUrls().isEmpty()) {
            sneaker.setImageUrls(request.getImageUrls());
        }

        return sneakerRepository.save(sneaker);
    }

    public void deleteSneaker(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Sneaker ID cannot be null");
        }
        
        Sneaker sneaker = getSneakerById(id);
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        if (sneaker.getSeller() == null || !sneaker.getSeller().getUsername().equals(username)) {
            throw new RuntimeException("You can only delete your own sneakers");
        }

        sneakerRepository.delete(sneaker);
    }

    public List<Sneaker> searchByBrand(String brand) {
        if (brand == null || brand.trim().isEmpty()) {
            return getAllSneakers();
        }
        return sneakerRepository.findByBrandContainingIgnoreCase(brand.trim());
    }

    public List<Sneaker> searchByName(String name) {
        if (name == null || name.trim().isEmpty()) {
            return getAllSneakers();
        }
        return sneakerRepository.findByNameContainingIgnoreCase(name.trim());
    }
}
