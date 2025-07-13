package com.example.SpringXEnv.Controllers;

import com.example.SpringXEnv.Entity.Complaint;
import com.example.SpringXEnv.Entity.UserEntity;
import com.example.SpringXEnv.Repository.UserRepository;
import com.example.SpringXEnv.Service.ComplaintService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
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
            @RequestParam(value = "latitude", required = false) Double latitude,
            @RequestParam(value = "longitude", required = false) Double longitude,
            @RequestParam(value = "address[doorNo]", required = false) String doorNo,
            @RequestParam(value = "address[street]", required = false) String street,
            @RequestParam(value = "address[villageOrTown]", required = false) String villageOrTown,
            @RequestParam(value = "address[district]", required = false) String district,
            @RequestParam(value = "address[state]", required = false) String state,
            @RequestParam(value = "address[pincode]", required = false) String pincode,
            @RequestPart(required = false) MultipartFile image) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String loginIdentifier = authentication.getName(); // typically email

        UserEntity user = userRepository.findByEmail(loginIdentifier)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String fullName = user.getName();

        logger.info("Submitting complaint for user: " + fullName);

        Complaint complaint = new Complaint();
        complaint.setUserName(fullName);
        complaint.setDescription(description);
        complaint.setCategory(category);
        complaint.setLocation(location);
        complaint.setLatitude(latitude);
        complaint.setLongitude(longitude);
        if (doorNo != null || street != null || villageOrTown != null || district != null || state != null || pincode != null) {
            complaint.setAddress(new Complaint.Address(doorNo, street, villageOrTown, district, state, pincode));
        }
        complaint.setStatus("Pending");
        complaint.setCreatedAt(LocalDateTime.now());

        logger.info("Complaint data before saving: " + complaint);

        Complaint savedComplaint = complaintService.submitComplaint(complaint, image);
        logger.info("Saved complaint: " + savedComplaint);
        return ResponseEntity.ok(savedComplaint);
    }

    @GetMapping("/reports")
    public ResponseEntity<List<Complaint>> getUserReports() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String loginIdentifier = authentication.getName();

        UserEntity user = userRepository.findByEmail(loginIdentifier)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String fullName = user.getName();

        List<Complaint> complaints = complaintService.getComplaintsByUser(fullName);
        logger.info("Fetched " + complaints.size() + " complaints for user: " + fullName);
        return ResponseEntity.ok(complaints);
    }

    @GetMapping("/complaints/{id}")
    public ResponseEntity<Complaint> getUserComplaintById(@PathVariable String id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String loginIdentifier = authentication.getName();
        logger.info("Fetching complaint " + id + " for user: " + loginIdentifier);
        try {
            Optional<Complaint> complaint = complaintService.getComplaintById(id);
            if (complaint.isPresent()) {
                if (complaint.get().getUserName().equals(userRepository.findByEmail(loginIdentifier).map(UserEntity::getName).orElse(""))) {
                    logger.info("Complaint found: " + complaint.get());
                    return ResponseEntity.ok(complaint.get());
                } else {
                    logger.warning("User " + loginIdentifier + " unauthorized to access complaint " + id);
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
        String loginIdentifier = authentication.getName();
        logger.info("Deleting complaint " + id + " for user: " + loginIdentifier);
        boolean deleted = complaintService.deleteUserComplaint(id, loginIdentifier);
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            logger.warning("Complaint " + id + " not found or unauthorized for user: " + loginIdentifier);
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/accept-resolution/{id}")
    public ResponseEntity<Complaint> acceptResolution(@PathVariable String id, @AuthenticationPrincipal UserDetails userDetails) {
        try {
            String userEmail = userDetails.getUsername();
            Complaint updatedComplaint = complaintService.acceptResolution(id, userEmail);
            return ResponseEntity.ok(updatedComplaint);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}