package com.example.SpringXEnv.Controllers;

import com.example.SpringXEnv.Entity.UserEntity;
import com.example.SpringXEnv.Repository.UserRepository;
import com.example.SpringXEnv.Service.AppUserDetailsService;
import com.example.SpringXEnv.io.AuthenticationRequest;
import com.example.SpringXEnv.io.AuthenticationResponse;
import com.example.SpringXEnv.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class AuthController {

    private final JwtUtil jwtUtil;
    private final AppUserDetailsService userDetailsService;
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody UserEntity user) {
        try {
            if (userRepository.findByEmail(user.getEmail()).isPresent()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new AuthenticationResponse(null, "Email already registered"));
            }
            String rawPassword = user.getPassword();
            user.setPassword(new BCryptPasswordEncoder().encode(rawPassword));
            user.setRole("USER");
            userRepository.save(user);
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getEmail(), rawPassword)
            );
            UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
            String jwtToken = jwtUtil.generateToken(userDetails);
            return ResponseEntity.ok(new AuthenticationResponse(user.getEmail(), jwtToken));
        } catch (Exception e) {
            System.err.println("Registration error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new AuthenticationResponse(null, "Registration failed: " + e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(@RequestBody AuthenticationRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
            UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
            String jwtToken = jwtUtil.generateToken(userDetails);
            return ResponseEntity.ok(new AuthenticationResponse(request.getEmail(), jwtToken));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthenticationResponse(null, "Invalid email or password"));
        } catch (Exception e) {
            System.err.println("Login error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new AuthenticationResponse(null, "Login failed: " + e.getMessage()));
        }
    }
}