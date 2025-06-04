package com.example.SpringXEnv.Entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "complaints")
public class Complaint {
    @Id
    private String id;
    private String userName;
    private String description;
    private String category;
    private String location;
    private Double latitude;
    private Double longitude;
    private Address address;
    private String status;
    private String remarks;
    private String imageUrl;
    private LocalDateTime createdAt;

    // Nested Address class
    public static class Address {
        private String doorNo;
        private String street;
        private String villageOrTown;
        private String district;
        private String state;
        private String pincode;

        public Address() {}

        public Address(String doorNo, String street, String villageOrTown, String district, String state, String pincode) {
            this.doorNo = doorNo;
            this.street = street;
            this.villageOrTown = villageOrTown;
            this.district = district;
            this.state = state;
            this.pincode = pincode;
        }

        // Getters and setters
        public String getDoorNo() { return doorNo; }
        public void setDoorNo(String doorNo) { this.doorNo = doorNo; }
        public String getStreet() { return street; }
        public void setStreet(String street) { this.street = street; }
        public String getVillageOrTown() { return villageOrTown; }
        public void setVillageOrTown(String villageOrTown) { this.villageOrTown = villageOrTown; }
        public String getDistrict() { return district; }
        public void setDistrict(String district) { this.district = district; }
        public String getState() { return state; }
        public void setState(String state) { this.state = state; }
        public String getPincode() { return pincode; }
        public void setPincode(String pincode) { this.pincode = pincode; }

        @Override
        public String toString() {
            return "Address{doorNo='" + doorNo + "', street='" + street + "', villageOrTown='" + villageOrTown +
                    "', district='" + district + "', state='" + state + "', pincode='" + pincode + "'}";
        }
    }

    // Getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public Address getAddress() { return address; }
    public void setAddress(Address address) { this.address = address; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    @Override
    public String toString() {
        return "Complaint{id='" + id + "', userName='" + userName + "', description='" + description +
                "', category='" + category + "', location='" + location + "', latitude=" + latitude +
                ", longitude=" + longitude + ", address=" + address + ", status='" + status +
                "', remarks='" + remarks + "', imageUrl='" + imageUrl + "', createdAt=" + createdAt + "}";
    }
}