package com.example.SpringXEnv.Controllers;

import com.example.SpringXEnv.Entity.Complaint;
import com.example.SpringXEnv.Service.ComplaintService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.logging.Logger;

@RestController
@RequestMapping("/api/admin/complaints")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175"}, allowCredentials = "true")
public class AdminComplaintController {

    private static final Logger logger = Logger.getLogger(AdminComplaintController.class.getName());

    @Autowired
    private ComplaintService complaintService;

    @GetMapping
    public List<Complaint> getAllComplaints(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String location,
            @RequestParam(defaultValue = "desc") String sort) {
        List<Complaint> complaints = complaintService.getAllComplaints(status, category, location, sort);
        logger.info("Fetched " + complaints.size() + " complaints with filters: status=" + status + ", category=" + category + ", location=" + location + ", sort=" + sort);
        complaints.forEach(complaint -> logger.info("Complaint: " + complaint));
        return complaints;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Complaint> getComplaintById(@PathVariable String id) {
        Optional<Complaint> complaint = complaintService.getComplaintById(id);
        if (complaint.isPresent()) {
            logger.info("Fetched complaint by ID " + id + ": " + complaint.get());
            return ResponseEntity.ok(complaint.get());
        } else {
            logger.warning("Complaint not found for ID: " + id);
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/resolved")
    public List<Complaint> getResolvedComplaints() {
        List<Complaint> complaints = complaintService.getComplaintsByStatus("Resolved");
        logger.info("Fetched " + complaints.size() + " resolved complaints");
        complaints.forEach(complaint -> logger.info("Resolved Complaint: " + complaint));
        return complaints;
    }

    @GetMapping("/in-progress")
    public List<Complaint> getInProgressComplaints() {
        List<Complaint> complaints = complaintService.getComplaintsByStatus("In Progress");
        logger.info("Fetched " + complaints.size() + " in-progress complaints");
        complaints.forEach(complaint -> logger.info("In-Progress Complaint: " + complaint));
        return complaints;
    }

    @PutMapping("/{id}")
    public ResponseEntity<Complaint> updateComplaint(@PathVariable String id, @RequestBody Map<String, String> updates) {
        try {
            String status = updates.get("status");
            String remarks = updates.getOrDefault("remarks", "");
            Complaint updatedComplaint = complaintService.updateComplaint(id, status, remarks);
            logger.info("Updated complaint ID " + id + ": " + updatedComplaint);
            return ResponseEntity.ok(updatedComplaint);
        } catch (RuntimeException e) {
            logger.warning("Failed to update complaint ID " + id + ": " + e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComplaint(@PathVariable String id) {
        boolean deleted = complaintService.deleteComplaint(id);
        if (deleted) {
            logger.info("Deleted complaint ID: " + id);
            return ResponseEntity.noContent().build();
        } else {
            logger.warning("Complaint not found for deletion, ID: " + id);
            return ResponseEntity.notFound().build();
        }
    }
}