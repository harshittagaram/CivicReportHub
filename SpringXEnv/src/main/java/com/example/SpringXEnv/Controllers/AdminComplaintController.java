package com.example.SpringXEnv.Controllers;


import com.example.SpringXEnv.Models.Complaint;
import com.example.SpringXEnv.Service.ComplaintService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/complaints")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5175"})
public class AdminComplaintController {

    @Autowired
    private ComplaintService complaintService;

    @GetMapping
    public List<Complaint> getAllComplaints(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String location
    ) {
        return complaintService.getAllComplaints(status, category, location);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Complaint> getComplaintById(@PathVariable String id) {
        Optional<Complaint> complaint = complaintService.getComplaintById(id);
        return complaint.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/resolved")
    public List<Complaint> getResolvedComplaints() {
        return complaintService.getComplaintsByStatus("Resolved");
    }

    @GetMapping("/in-progress")
    public List<Complaint> getInProgressComplaints() {
        return complaintService.getComplaintsByStatus("In Progress");
    }



    @PutMapping("/{id}")
    public Complaint updateComplaint(@PathVariable String id, @RequestBody Map<String, String> updates) {
        String status = updates.get("status");
        String remarks = updates.getOrDefault("remarks", "");
        return complaintService.updateComplaint(id, status, remarks);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComplaint(@PathVariable String id) {
        boolean deleted = complaintService.deleteComplaint(id);
        if (deleted) {
            return ResponseEntity.noContent().build(); // 204 No Content
        } else {
            return ResponseEntity.notFound().build(); // 404 Not Found if complaint doesn't exist
        }
    }

}
