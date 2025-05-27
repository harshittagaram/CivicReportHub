package com.example.SpringXEnv.io;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
public class AuthenticationResponse {
    private String email;
    private String token;

    public AuthenticationResponse() {}

    public AuthenticationResponse(String email, String token) {
        this.email = email;
        this.token = token;
    }

    public String getEmail() {
        return email;
    }

    public String getToken() {
        return token;
    }
}

