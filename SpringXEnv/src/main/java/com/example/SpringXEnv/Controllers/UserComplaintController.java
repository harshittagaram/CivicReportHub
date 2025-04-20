package com.example.SpringXEnv.Controllers;

import com.example.SpringXEnv.Models.Complaint;
import com.example.SpringXEnv.Service.ComplaintService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*")
public class UserComplaintController {

    @Autowired
    private ComplaintService complaintService;

    @PostMapping("/complaints")
    public ResponseEntity<Complaint> submitComplaint(
            @RequestParam String userName,
            @RequestParam String description,
            @RequestParam String category,
            @RequestParam String location,
            @RequestPart(required = false) MultipartFile image) {

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

    @GetMapping
    public List<Complaint> getUserComplaints(@RequestParam String userName) {
        return complaintService.getComplaintsByUser(userName);
    }
}
