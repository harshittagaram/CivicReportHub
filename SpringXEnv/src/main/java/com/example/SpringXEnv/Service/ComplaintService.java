package com.example.SpringXEnv.Service;

import com.example.SpringXEnv.Entity.UserEntity;
import com.example.SpringXEnv.Models.Complaint;
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
import java.util.stream.Collectors;

@Service
public class ComplaintService {

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private S3Client s3Client;

    @Value("${aws.s3.bucket.name}")
    private String bucketName;

    public Complaint submitComplaint(Complaint complaint, MultipartFile image) {
        // Upload image if present
        if (image != null && !image.isEmpty()) {
            String imageUrl = uploadFile(image);
            complaint.setImageUrl(imageUrl);
        }

        // Convert email to full name
        String email = complaint.getUserName(); // assuming this field temporarily holds email
        Optional<UserEntity> userOptional = userRepository.findByEmail(email);
        if (userOptional.isPresent()) {
            complaint.setUserName(userOptional.get().getName()); // replace email with full name
        }

        return complaintRepository.save(complaint);
    }
    public List<Complaint> getComplaintsByUser(String userName) {
        return complaintRepository.findByUserName(userName);
    }

    public List<Complaint> getAllComplaints(String status, String category, String location, String sort) {
        Sort sortOrder = sort.equalsIgnoreCase("asc") ? Sort.by("createdAt").ascending() : Sort.by("createdAt").descending();
        List<Complaint> complaints = complaintRepository.findAll(sortOrder);

        return complaints.stream()
                .filter(c -> status == null || c.getStatus().equalsIgnoreCase(status))
                .filter(c -> category == null || c.getCategory().equalsIgnoreCase(category))
                .filter(c -> location == null || c.getLocation().toLowerCase().contains(location.toLowerCase()))
                .collect(Collectors.toList());
    }

    public Optional<Complaint> getComplaintById(String id) {
        return complaintRepository.findById(id);
    }

    public List<Complaint> getComplaintsByStatus(String status) {
        Sort sortOrder = Sort.by("createdAt").descending(); // Sort status-specific complaints by latest first
        return complaintRepository.findByStatusIgnoreCase(status, sortOrder);
    }

    public Complaint updateComplaint(String id, String status, String remarks) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));
        complaint.setStatus(status);
        complaint.setRemarks(remarks);
        return complaintRepository.save(complaint);
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
                return "https://" + bucketName + ".s3.amazonaws.com/" + key;
            } else {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Image upload failed");
            }
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to upload image", e);
        }
    }

    public boolean deleteComplaint(String id) {
        Optional<Complaint> complaint = complaintRepository.findById(id);
        if (complaint.isPresent()) {
            Complaint c = complaint.get();
            if (c.getImageUrl() != null && !c.getImageUrl().isEmpty()) {
                deleteImageFromS3(c.getImageUrl());
            }
            complaintRepository.deleteById(id);
            return true;
        }
        return false;
    }
    public boolean deleteUserComplaint(String id, String userEmail) {
        Optional<Complaint> complaint = complaintRepository.findById(id);
        if (complaint.isPresent()) {
            Complaint c = complaint.get();
            if (!c.getUserName().equals(userEmail)) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only delete your own complaints");
            }
            if (c.getImageUrl() != null && !c.getImageUrl().isEmpty()) {
                deleteImageFromS3(c.getImageUrl());
            }
            complaintRepository.deleteById(id);
            return true;
        }
        return false;
    }

    private void deleteImageFromS3(String imageUrl) {
        try {
            String key = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
            DeleteObjectRequest request = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();
            s3Client.deleteObject(request);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to delete image from S3", e);
        }
    }
}