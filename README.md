
![Screenshot 2025-05-21 233713](https://github.com/user-attachments/assets/66ba5e93-e881-49e8-b3c1-67f8f8a01d17)
![Screenshot 2025-05-21 233626](https://github.com/user-attachments/assets/95e1eade-3ee1-4f27-bea0-cfebd1e8bb88)
![Screenshot 2025-05-21 233657](https://github.com/user-attachments/assets/dc3c1dde-b654-42f6-b884-60f684a584ba)
![Screenshot 2025-05-21 233755](https://github.com/user-attachments/assets/4d4394df-af39-43da-ba09-6ba0c59134d7)
# 🏙️ Civic Report Hub

**Civic Report Hub** is a full-stack civic engagement platform that allows citizens to report local environmental and civic issues—such as garbage dumping, potholes, and water logging—so that municipal workers and administrators can address them efficiently.

---

## ✨ Features

### 👥 User Panel
- Submit reports with:
  - Title, description
  - Auto-detected or manual location
  - Category selection (e.g., Garbage, Pothole, Pollution)
  - Image upload (via AWS S3)
- Track submitted reports
- Filter reports by category or status

### 🛠️ Admin Panel
- View all submitted reports
- Filter and search by category, status, or location
- Assign reports to workers
- Update status and add remarks

### 🧑‍🔧 Worker Panel
- View assigned reports
- Update status (e.g., In Progress, Resolved)
- Add completion remarks
- Upload optional images post-resolution

---

## 🧱 Tech Stack

### 🔧 Backend (Spring Boot)
- **Spring Boot** for REST APIs
- **MongoDB** as the NoSQL database
- **AWS S3** for image storage
- **Location API** (e.g., ipinfo.io) for geo-detection

### 💻 Frontend (React)
- **React.js** with Hooks and React Router
- **Axios** for API integration
- Responsive design for mobile and desktop
- Separate routes and components for user, worker, and admin roles

---

## 🚀 Installation & Setup

### Backend (Spring Boot)
```bash
git clone https://github.com/yourusername/civic-report-hub-backend.git
cd civic-report-hub-backend

# Configure application.properties:
# - MongoDB URI
# - AWS credentials and bucket!

# - Server port (default 8081)

./mvnw spring-boot:run
