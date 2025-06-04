package com.example.SpringXEnv.Service;

import com.example.SpringXEnv.Entity.Complaint;
import com.example.SpringXEnv.Entity.UserEntity;
import com.example.SpringXEnv.Repository.ComplaintRepository;
import com.example.SpringXEnv.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectResponse;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.logging.Logger;
import java.util.stream.Collectors;

@Service
public class ComplaintService {

    private static final Logger logger = Logger.getLogger(ComplaintService.class.getName());

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private S3Client s3Client;

    @Value("${aws.s3.bucket.name}")
    private String bucketName;

    public Complaint submitComplaint(Complaint complaint, MultipartFile image) {
        logger.info("Submitting complaint: " + complaint);
        if (image != null && !image.isEmpty()) {
            String imageUrl = uploadFile(image);
            complaint.setImageUrl(imageUrl);
            logger.info("Uploaded image: " + imageUrl);
        }
        Complaint savedComplaint = complaintRepository.save(complaint);
        logger.info("Saved complaint: " + savedComplaint);
        return savedComplaint;
    }

    public List<Complaint> getComplaintsByUser(String userName) {
        List<Complaint> complaints = complaintRepository.findByUserName(userName);
        logger.info("Fetched " + complaints.size() + " complaints for user: " + userName);
        return complaints;
    }

    public List<Complaint> getAllComplaints(String status, String category, String location, String sort) {
        Sort sortOrder = sort.equalsIgnoreCase("asc") ? Sort.by("createdAt").ascending() : Sort.by("createdAt").descending();
        List<Complaint> complaints = complaintRepository.findAll(sortOrder);
        List<Complaint> filteredComplaints = complaints.stream()
                .filter(c -> status == null || c.getStatus().equalsIgnoreCase(status))
                .filter(c -> category == null || c.getCategory().equalsIgnoreCase(category))
                .filter(c -> location == null || c.getLocation().toLowerCase().contains(location.toLowerCase()))
                .collect(Collectors.toList());
        logger.info("Fetched " + filteredComplaints.size() + " complaints with filters: status=" + status + ", category=" + category + ", location=" + location);
        return filteredComplaints;
    }

    public Optional<Complaint> getComplaintById(String id) {
        Optional<Complaint> complaint = complaintRepository.findById(id);
        logger.info("Fetched complaint with ID " + id + ": " + complaint.orElse(null));
        return complaint;
    }

    public List<Complaint> getComplaintsByStatus(String status) {
        Sort sortOrder = Sort.by("createdAt").descending();
        List<Complaint> complaints = complaintRepository.findByStatusIgnoreCase(status, sortOrder);
        logger.info("Fetched " + complaints.size() + " complaints with status: " + status);
        return complaints;
    }

    public Complaint updateComplaint(String id, String status, String remarks) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));
        complaint.setStatus(status);
        complaint.setRemarks(remarks);
        Complaint updatedComplaint = complaintRepository.save(complaint);
        logger.info("Updated complaint with ID " + id + ": " + updatedComplaint);
        return updatedComplaint;
    }

    public boolean deleteComplaint(String id) {
        Optional<Complaint> complaint = complaintRepository.findById(id);
        if (complaint.isPresent()) {
            Complaint c = complaint.get();
            if (c.getImageUrl() != null && !c.getImageUrl().isEmpty()) {
                deleteImageFromS3(c.getImageUrl());
                logger.info("Deleted image from S3: " + c.getImageUrl());
            }
            complaintRepository.deleteById(id);
            logger.info("Deleted complaint with ID " + id);
            return true;
        }
        logger.warning("Complaint with ID " + id + " not found for deletion");
        return false;
    }

    public boolean deleteUserComplaint(String id, String userEmail) {
        Optional<Complaint> complaint = complaintRepository.findById(id);
        if (complaint.isPresent()) {
            Complaint c = complaint.get();
            String userName = userRepository.findByEmail(userEmail).map(UserEntity::getName).orElse("");
            if (!c.getUserName().equals(userName)) {
                logger.warning("User with email " + userEmail + " unauthorized to delete complaint " + id);
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only delete your own complaints");
            }
            if (c.getImageUrl() != null && !c.getImageUrl().isEmpty()) {
                deleteImageFromS3(c.getImageUrl());
                logger.info("Deleted image from S3: " + c.getImageUrl());
            }
            complaintRepository.deleteById(id);
            logger.info("Deleted complaint with ID " + id + " by user: " + userEmail);
            return true;
        }
        logger.warning("Complaint with ID " + id + " not found for deletion");
        return false;
    }

    private String uploadFile(MultipartFile file) {
        String extension = file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf('.') + 1);
        String key = UUID.randomUUID().toString() + "." + extension;
        try {
            PutObjectRequest request = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .acl("public-read")
                    .contentType(file.getContentType())
                    .build();
            PutObjectResponse response = s3Client.putObject(request, RequestBody.fromBytes(file.getBytes()));
            if (response.sdkHttpResponse().isSuccessful()) {
                String imageUrl = "https://" + bucketName + ".s3.amazonaws.com/" + key;
                logger.info("Uploaded file to S3: " + imageUrl);
                return imageUrl;
            } else {
                logger.severe("Failed to upload image to S3");
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Image upload failed");
            }
        } catch (IOException e) {
            logger.severe("IOException during image upload: " + e.getMessage());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to upload image", e);
        }
    }

    private void deleteImageFromS3(String imageUrl) {
        try {
            String key = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
            DeleteObjectRequest request = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();
            s3Client.deleteObject(request);
            logger.info("Deleted image from S3: " + imageUrl);
        } catch (Exception e) {
            logger.severe("Failed to delete image from S3: " + e.getMessage());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to delete image from S3", e);
        }
    }
}