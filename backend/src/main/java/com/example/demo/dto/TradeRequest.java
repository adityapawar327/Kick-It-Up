package com.example.demo.dto;

import jakarta.validation.constraints.NotNull;

public class TradeRequest {
    @NotNull(message = "Requested sneaker ID is required")
    private Long requestedSneakerId;
    
    @NotNull(message = "Offered sneaker ID is required")
    private Long offeredSneakerId;
    
    private String message;

    public Long getRequestedSneakerId() { return requestedSneakerId; }
    public void setRequestedSneakerId(Long requestedSneakerId) { this.requestedSneakerId = requestedSneakerId; }

    public Long getOfferedSneakerId() { return offeredSneakerId; }
    public void setOfferedSneakerId(Long offeredSneakerId) { this.offeredSneakerId = offeredSneakerId; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
