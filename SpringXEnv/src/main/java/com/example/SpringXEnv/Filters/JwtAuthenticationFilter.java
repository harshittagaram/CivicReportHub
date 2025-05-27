package com.example.SpringXEnv.Filters;

import com.example.SpringXEnv.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.logging.Logger;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private static final Logger logger = Logger.getLogger(JwtAuthenticationFilter.class.getName());

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String requestURI = request.getRequestURI();
        logger.info("Processing request: " + requestURI);

        // Skip authentication for public endpoints
        if (requestURI.startsWith("/api/admin") ||
                requestURI.equals("/api/user/login") ||
                requestURI.equals("/api/user/register")) {
            logger.info("Skipping authentication for: " + requestURI);
            filterChain.doFilter(request, response);
            return;
        }

        // Extract Authorization header
        final String authHeader = request.getHeader("Authorization");
        logger.info("Authorization header: " + authHeader);

        if (StringUtils.hasText(authHeader) && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            logger.info("Extracted token: " + token);

            try {
                String email = jwtUtil.extractUsername(token);
                logger.info("Extracted email: " + email);

                if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    UserDetails userDetails = userDetailsService.loadUserByUsername(email);
                    logger.info("UserDetails loaded: " + userDetails.getUsername() + ", Authorities: " + userDetails.getAuthorities());

                    if (jwtUtil.validateToken(token, userDetails)) {
                        logger.info("Token is valid for user: " + email);
                        UsernamePasswordAuthenticationToken authentication =
                                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                        logger.info("Authentication set for user: " + email);
                    } else {
                        logger.severe("Token validation failed for user: " + email);
                        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                        response.getWriter().write("Invalid or expired token");
                        return;
                    }
                } else {
                    logger.warning("No email extracted or authentication already exists for: " + requestURI);
                }
            } catch (Exception e) {
                logger.severe("Error processing token: " + e.getMessage());
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                response.getWriter().write("Token processing error: " + e.getMessage());
                return;
            }
        } else {
            logger.warning("Missing or invalid Authorization header for request: " + requestURI);
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.getWriter().write("Missing or invalid Authorization header");
            return;
        }

        filterChain.doFilter(request, response);
    }
}