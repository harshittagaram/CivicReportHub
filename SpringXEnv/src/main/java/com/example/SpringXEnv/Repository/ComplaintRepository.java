package com.example.SpringXEnv.Repository;


import com.example.SpringXEnv.Models.Complaint;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplaintRepository extends MongoRepository<Complaint, String> {
    List<Complaint> findByUserName(String userName);

    List<Complaint> findByStatusIgnoreCase(String status);
}
