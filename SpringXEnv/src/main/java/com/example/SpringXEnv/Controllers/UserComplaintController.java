package com.example.SpringXEnv.Controllers;

import com.example.SpringXEnv.Entity.UserEntity;
import com.example.SpringXEnv.Models.Complaint;
import com.example.SpringXEnv.Repository.UserRepository;
import com.example.SpringXEnv.Service.ComplaintService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175"})
public class UserComplaintController {

    private static final Logger logger = Logger.getLogger(UserComplaintController.class.getName());

    @Autowired
    private ComplaintService complaintService;

    @Autowired
    private UserRepository userRepository;


    @PostMapping("/complaints")
    public ResponseEntity<Complaint> submitComplaint(
            @RequestParam String description,
            @RequestParam String category,
            @RequestParam String location,
            @RequestPart(required = false) MultipartFile image) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String loginIdentifier = authentication.getName(); // typically email or username

        // Find user using loginIdentifier
        UserEntity user = userRepository.findByEmail(loginIdentifier)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String fullName = user.getName(); // or user.getFullName(), based on your entity

        logger.info("Submitting complaint for user: " + fullName);

        Complaint complaint = new Complaint();
        complaint.setUserName(fullName); // ✅ Correct full name used here
        complaint.setDescription(description);
        complaint.setCategory(category);
        complaint.setLocation(location);
        complaint.setStatus("Pending");
        complaint.setCreatedAt(LocalDateTime.now());

        Complaint savedComplaint = complaintService.submitComplaint(complaint, image);
        return ResponseEntity.ok(savedComplaint);
    }

    @GetMapping("/reports")
    public ResponseEntity<List<Complaint>> getUserReports() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String loginIdentifier = authentication.getName(); // email or username

        UserEntity user = userRepository.findByEmail(loginIdentifier)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String fullName = user.getName();

        List<Complaint> complaints = complaintService.getComplaintsByUser(fullName);
        return ResponseEntity.ok(complaints);
    }


    @GetMapping("/complaints/{id}")
    public ResponseEntity<Complaint> getUserComplaintById(@PathVariable String id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userName = authentication.getName();
        logger.info("Fetching complaint " + id + " for user: " + userName);
        try {
            Optional<Complaint> complaint = complaintService.getComplaintById(id);
            if (complaint.isPresent()) {
                if (complaint.get().getUserName().equals(userName)) {
                    return ResponseEntity.ok(complaint.get());
                } else {
                    logger.warning("User " + userName + " unauthorized to access complaint " + id);
                    return ResponseEntity.status(403).body(null);
                }
            } else {
                logger.warning("Complaint " + id + " not found");
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.severe("Error fetching complaint " + id + ": " + e.getMessage());
            throw e;
        }
    }

    @DeleteMapping("/complaints/{id}")
    public ResponseEntity<Void> deleteComplaint(@PathVariable String id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userName = authentication.getName();
        logger.info("Deleting complaint " + id + " for user: " + userName);
        boolean deleted = complaintService.deleteUserComplaint(id, userName);
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            logger.warning("Complaint " + id + " not found or unauthorized for user: " + userName);
            return ResponseEntity.notFound().build();
        }
    }
}