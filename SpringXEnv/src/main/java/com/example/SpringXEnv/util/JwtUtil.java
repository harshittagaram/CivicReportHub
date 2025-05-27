package com.example.SpringXEnv.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;
import java.util.logging.Logger;

@Component
public class JwtUtil {
    private static final Logger logger = Logger.getLogger(JwtUtil.class.getName());

    @Value("${jwt.secret.key}")
    private String SECRET_KEY;

    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        logger.info("Generating token for user: " + userDetails.getUsername());
        return createToken(claims, userDetails.getUsername());
    }

    private String createToken(Map<String, Object> claims, String subject) {
        logger.info("Creating token with subject: " + subject);
        Date issuedAt = new Date(System.currentTimeMillis());
        Date expiration = new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10); // 10 hours
        logger.info("Token issued at: " + issuedAt + ", expires at: " + expiration);
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(issuedAt)
                .setExpiration(expiration)
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
    }

    public String extractUsername(String token) {
        String username = extractClaim(token, Claims::getSubject);
        logger.info("Extracted username from token: " + username);
        return username;
    }

    public Date extractExpiration(String token) {
        Date expiration = extractClaim(token, Claims::getExpiration);
        logger.info("Extracted expiration from token: " + expiration);
        return expiration;
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        try {
            logger.info("Parsing token claims");
            Claims claims = Jwts.parser()
                    .setSigningKey(SECRET_KEY)
                    .parseClaimsJws(token)
                    .getBody();
            logger.info("Claims extracted: " + claims);
            return claims;
        } catch (Exception e) {
            logger.severe("Failed to parse token: " + e.getMessage());
            throw e;
        }
    }

    private Boolean isTokenExpired(String token) {
        boolean expired = extractExpiration(token).before(new Date());
        logger.info("Token expired: " + expired);
        return expired;
    }

    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        logger.info("Validating token for username: " + username + ", expected: " + userDetails.getUsername());
        boolean isValid = username.equals(userDetails.getUsername()) && !isTokenExpired(token);
        logger.info("Token validation result: " + isValid);
        if (!isValid) {
            logger.warning("Validation failed - Username match: " + username.equals(userDetails.getUsername()) +
                    ", Expired: " + isTokenExpired(token));
        }
        return isValid;
    }
}