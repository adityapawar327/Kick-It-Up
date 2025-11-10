package com.example.demo.service;

import com.example.demo.model.Favorite;
import com.example.demo.model.Sneaker;
import com.example.demo.model.User;
import com.example.demo.repository.FavoriteRepository;
import com.example.demo.repository.SneakerRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class FavoriteService {
    @Autowired
    private FavoriteRepository favoriteRepository;

    @Autowired
    private SneakerRepository sneakerRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public Favorite addToFavorites(Long sneakerId) {
        if (sneakerId == null) {
            throw new RuntimeException("Sneaker ID cannot be null");
        }
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Sneaker sneaker = sneakerRepository.findById(sneakerId)
                .orElseThrow(() -> new RuntimeException("Sneaker not found"));

        if (favoriteRepository.existsByUserAndSneaker(user, sneaker)) {
            throw new RuntimeException("Sneaker already in favorites");
        }

        Favorite favorite = new Favorite();
        favorite.setUser(user);
        favorite.setSneaker(sneaker);

        return favoriteRepository.save(favorite);
    }

    @Transactional(readOnly = true)
    public List<Sneaker> getMyFavorites() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Favorite> favorites = favoriteRepository.findByUserWithSneaker(user);
        return favorites.stream()
                .map(fav -> {
                    Sneaker sneaker = fav.getSneaker();
                    // Force load lazy relationships
                    sneaker.getName();
                    if (sneaker.getSeller() != null) {
                        sneaker.getSeller().getUsername();
                    }
                    return sneaker;
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public void removeFromFavorites(Long sneakerId) {
        if (sneakerId == null) {
            throw new RuntimeException("Sneaker ID cannot be null");
        }
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Sneaker sneaker = sneakerRepository.findById(sneakerId)
                .orElseThrow(() -> new RuntimeException("Sneaker not found"));

        favoriteRepository.deleteByUserAndSneaker(user, sneaker);
    }

    @Transactional(readOnly = true)
    public boolean isFavorite(Long sneakerId) {
        if (sneakerId == null) {
            return false;
        }
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Sneaker sneaker = sneakerRepository.findById(sneakerId)
                .orElseThrow(() -> new RuntimeException("Sneaker not found"));

        return favoriteRepository.existsByUserAndSneaker(user, sneaker);
    }
}
