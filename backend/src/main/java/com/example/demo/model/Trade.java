package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "trades")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Trade {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "requester_id", nullable = false)
    private User requester; // Person proposing the trade

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner; // Person receiving the trade request

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "offered_sneaker_id", nullable = false)
    private Sneaker offeredSneaker; // Sneaker being offered by requester

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "requested_sneaker_id", nullable = false)
    private Sneaker requestedSneaker; // Sneaker being requested from owner

    @Column(columnDefinition = "TEXT")
    private String message;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private TradeStatus status = TradeStatus.PENDING;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt;

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum TradeStatus {
        PENDING,
        ACCEPTED,
        DECLINED,
        CANCELLED
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getRequester() { return requester; }
    public void setRequester(User requester) { this.requester = requester; }

    public User getOwner() { return owner; }
    public void setOwner(User owner) { this.owner = owner; }

    public Sneaker getOfferedSneaker() { return offeredSneaker; }
    public void setOfferedSneaker(Sneaker offeredSneaker) { this.offeredSneaker = offeredSneaker; }

    public Sneaker getRequestedSneaker() { return requestedSneaker; }
    public void setRequestedSneaker(Sneaker requestedSneaker) { this.requestedSneaker = requestedSneaker; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public TradeStatus getStatus() { return status; }
    public void setStatus(TradeStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
