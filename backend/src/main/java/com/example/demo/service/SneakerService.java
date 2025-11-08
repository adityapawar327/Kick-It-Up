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
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User seller = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Sneaker sneaker = new Sneaker();
        sneaker.setName(request.getName());
        sneaker.setBrand(request.getBrand());
        sneaker.setDescription(request.getDescription());
        sneaker.setPrice(request.getPrice());
        sneaker.setSize(request.getSize());
        sneaker.setColor(request.getColor());
        sneaker.setCondition(request.getCondition());
        sneaker.setStock(request.getStock());
        sneaker.setImageUrls(request.getImageUrls());
        sneaker.setSeller(seller);

        return sneakerRepository.save(sneaker);
    }

    public List<Sneaker> getAllSneakers() {
        return sneakerRepository.findAllWithSeller();
    }

    public List<Sneaker> getAvailableSneakers() {
        return sneakerRepository.findByStatus(Sneaker.SneakerStatus.AVAILABLE);
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
        Sneaker sneaker = getSneakerById(id);
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        if (!sneaker.getSeller().getUsername().equals(username)) {
            throw new RuntimeException("You can only update your own sneakers");
        }

        sneaker.setName(request.getName());
        sneaker.setBrand(request.getBrand());
        sneaker.setDescription(request.getDescription());
        sneaker.setPrice(request.getPrice());
        sneaker.setSize(request.getSize());
        sneaker.setColor(request.getColor());
        sneaker.setCondition(request.getCondition());
        sneaker.setStock(request.getStock());
        if (request.getImageUrls() != null) {
            sneaker.setImageUrls(request.getImageUrls());
        }

        return sneakerRepository.save(sneaker);
    }

    public void deleteSneaker(Long id) {
        Sneaker sneaker = getSneakerById(id);
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        if (!sneaker.getSeller().getUsername().equals(username)) {
            throw new RuntimeException("You can only delete your own sneakers");
        }

        sneakerRepository.delete(sneaker);
    }

    public List<Sneaker> searchByBrand(String brand) {
        return sneakerRepository.findByBrandContainingIgnoreCase(brand);
    }

    public List<Sneaker> searchByName(String name) {
        return sneakerRepository.findByNameContainingIgnoreCase(name);
    }
}
