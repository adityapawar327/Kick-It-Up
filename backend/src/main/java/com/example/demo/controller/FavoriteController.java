package com.example.demo.controller;

import com.example.demo.model.Favorite;
import com.example.demo.model.Sneaker;
import com.example.demo.service.FavoriteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {
    @Autowired
    private FavoriteService favoriteService;

    @PostMapping("/{sneakerId}")
    public ResponseEntity<Favorite> addToFavorites(@PathVariable Long sneakerId) {
        return ResponseEntity.ok(favoriteService.addToFavorites(sneakerId));
    }

    @GetMapping
    public ResponseEntity<List<Sneaker>> getMyFavorites() {
        return ResponseEntity.ok(favoriteService.getMyFavorites());
    }

    @DeleteMapping("/{sneakerId}")
    public ResponseEntity<Void> removeFromFavorites(@PathVariable Long sneakerId) {
        favoriteService.removeFromFavorites(sneakerId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{sneakerId}/check")
    public ResponseEntity<Map<String, Boolean>> isFavorite(@PathVariable Long sneakerId) {
        boolean isFav = favoriteService.isFavorite(sneakerId);
        return ResponseEntity.ok(Map.of("isFavorite", isFav));
    }
}
