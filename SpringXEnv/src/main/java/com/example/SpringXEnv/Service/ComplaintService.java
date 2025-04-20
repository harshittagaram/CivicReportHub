package com.example.SpringXEnv.Service;

import com.example.SpringXEnv.Models.Complaint;
import com.example.SpringXEnv.Repository.ComplaintRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectResponse;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ComplaintService {

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private S3Client s3Client;

    @Value("${aws.s3.bucket.name}")
    private String bucketName;

    public Complaint submitComplaint(Complaint complaint, MultipartFile image) {
        if (image != null && !image.isEmpty()) {
            String imageUrl = uploadFile(image);
            complaint.setImageUrl(imageUrl);
        }
        return complaintRepository.save(complaint);
    }

    public List<Complaint> getComplaintsByUser(String userName) {
        return complaintRepository.findByUserName(userName);
    }

    public List<Complaint> getAllComplaints(String status, String category, String location) {
        List<Complaint> all = complaintRepository.findAll();
        return all.stream()
                .filter(c -> status == null || c.getStatus().equalsIgnoreCase(status))
                .filter(c -> category == null || c.getCategory().equalsIgnoreCase(category))
                .filter(c -> location == null || c.getLocation().toLowerCase().contains(location.toLowerCase()))
                .toList();
    }

    public Optional<Complaint> getComplaintById(String id) {
        return complaintRepository.findById(id);
    }

    public List<Complaint> getComplaintsByStatus(String status) {
        return complaintRepository.findByStatusIgnoreCase(status);
    }


    public Complaint updateComplaint(String id, String status, String remarks) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));
        complaint.setStatus(status);
        complaint.setRemarks(remarks);
        return complaintRepository.save(complaint);
    }

    public boolean deleteComplaint(String id) {
        Optional<Complaint> complaint = complaintRepository.findById(id);
        if (complaint.isPresent()) {
            complaintRepository.deleteById(id);
            return true;
        }
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
                return "https://" + bucketName + ".s3.amazonaws.com/" + key;
            } else {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Image upload failed");
            }
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to upload image", e);
        }

    }
}
