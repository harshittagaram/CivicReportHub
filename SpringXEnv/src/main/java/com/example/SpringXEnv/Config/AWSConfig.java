package com.example.SpringXEnv.Config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;

@Configuration
public class AWSConfig {
    @Value("${aws.access.key}")
    private String accessKey;
    @Value("${aws.secret.key}")
    private String secretKey;
    @Value("${aws.region}")
    private String region;
    @Value("${aws.s3.bucket.name}")
    private String bucketName;

    @Bean(name = "s3BucketName") // Explicitly naming the bean to avoid conflicts
    public String bucketName() {
        return bucketName;
    }



    @Bean
    public S3Client s3Client(){
        return S3Client.builder().region(Region.of(region)).credentialsProvider(StaticCredentialsProvider
                .create(AwsBasicCredentials.create(accessKey,secretKey))).build();
    }
}
