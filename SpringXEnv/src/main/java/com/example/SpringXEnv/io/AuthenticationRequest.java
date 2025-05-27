package com.example.SpringXEnv.io;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
public class AuthenticationRequest {
    private String email;
    private String password;

    // No-argument constructor
    public AuthenticationRequest() {
    }

    // All-argument constructor
    public AuthenticationRequest(String email, String password) {
        this.email = email;
        this.password = password;
    }

    // Getters and setters
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    // Optional: toString() for debugging
    @Override
    public String toString() {
        return "AuthenticationRequest{" +
                "email='" + email + '\'' +
                ", password='" + password + '\'' +
                '}';
    }
}

