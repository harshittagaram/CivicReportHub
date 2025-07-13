package com.example.SpringXEnv.io;

public class UserProfile {
    private String id;
    private String name;
    private String email;

    public UserProfile(String id, String name, String email) {
        this.id = id;
        this.name = name;
        this.email = email;
    }

    // Getters (and setters if needed)
    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }
}
