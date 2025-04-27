package com.example.SpringXEnv.Controllers;

import com.example.SpringXEnv.Models.Complaint;
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
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class UserComplaintController {

    @Autowired
    private ComplaintService complaintService;

    @PostMapping("/complaints")
    public ResponseEntity<Complaint> submitComplaint(
            @RequestParam String description,
            @RequestParam String category,
            @RequestParam String location,
            @RequestPart(required = false) MultipartFile image) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userName = authentication.getName();
        Complaint complaint = new Complaint();
        complaint.setUserName(userName);
        complaint.setDescription(description);
        complaint.setCategory(category);
        complaint.setLocation(location);
        complaint.setStatus("Pending");
        complaint.setCreatedAt(LocalDateTime.now());
        Complaint savedComplaint = complaintService.submitComplaint(complaint, image);
        return ResponseEntity.ok(savedComplaint);
    }

    @GetMapping("/reports")
    public List<Complaint> getUserReports() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userName = authentication.getName();
        try {
            List<Complaint> complaints = complaintService.getComplaintsByUser(userName);
            return complaints;
        } catch (Exception e) {
            throw e;
        }
    }

    @GetMapping("/complaints/{id}")
    public ResponseEntity<Complaint> getUserComplaintById(@PathVariable String id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userName = authentication.getName();
        try {
            Optional<Complaint> complaint = complaintService.getComplaintById(id);
            if (complaint.isPresent()) {
                if (complaint.get().getUserName().equals(userName)) {
                    return ResponseEntity.ok(complaint.get());
                } else {
                    return ResponseEntity.status(403).body(null);
                }
            } else {
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            throw e;
        }
    }
}