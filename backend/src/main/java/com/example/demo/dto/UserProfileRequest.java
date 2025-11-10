package com.example.demo.dto;

import jakarta.validation.constraints.Email;

public class UserProfileRequest {
    private String fullName;
    
    @Email(message = "Email should be valid")
    private String email;
    
    private String phoneNumber;
    private String address;
    private String profileImage;
    private Boolean isSeller;
    private String aboutMe;

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getProfileImage() { return profileImage; }
    public void setProfileImage(String profileImage) { this.profileImage = profileImage; }

    public Boolean getIsSeller() { return isSeller; }
    public void setIsSeller(Boolean isSeller) { this.isSeller = isSeller; }

    public String getAboutMe() { return aboutMe; }
    public void setAboutMe(String aboutMe) { this.aboutMe = aboutMe; }
}
