package com.example.demo.service;

import com.example.demo.dto.ReviewRequest;
import com.example.demo.model.Review;
import com.example.demo.model.Sneaker;
import com.example.demo.model.User;
import com.example.demo.repository.ReviewRepository;
import com.example.demo.repository.SneakerRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional
public class ReviewService {
    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private SneakerRepository sneakerRepository;

    @Autowired
    private UserRepository userRepository;

    public Review createReview(ReviewRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Sneaker sneaker = sneakerRepository.findById(request.getSneakerId())
                .orElseThrow(() -> new RuntimeException("Sneaker not found"));

        if (reviewRepository.findBySneakerAndUser(sneaker, user).isPresent()) {
            throw new RuntimeException("You have already reviewed this sneaker");
        }

        Review review = new Review();
        review.setSneaker(sneaker);
        review.setUser(user);
        review.setRating(request.getRating());
        review.setComment(request.getComment());

        return reviewRepository.save(review);
    }

    @Transactional(readOnly = true)
    public List<com.example.demo.dto.ReviewResponse> getReviewsBySneaker(Long sneakerId) {
        Sneaker sneaker = sneakerRepository.findById(sneakerId)
                .orElseThrow(() -> new RuntimeException("Sneaker not found"));
        List<Review> reviews = reviewRepository.findBySneakerWithUser(sneaker);
        return reviews.stream()
                .map(com.example.demo.dto.ReviewResponse::new)
                .toList();
    }

    public List<Review> getMyReviews() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return reviewRepository.findByUser(user);
    }

    public void deleteReview(Long id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!review.getUser().getUsername().equals(username)) {
            throw new RuntimeException("You can only delete your own reviews");
        }

        reviewRepository.delete(review);
    }
}
