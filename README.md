Assignment Management System Backend
Overview
This is the backend for an Assignment Management System built with Node.js, Express, and MongoDB. It provides APIs for user authentication, assignment management, user management, and submission handling.
Project Structure
assignment-management-system/
├── backends/
│   ├── config/
│   │   ├── database.js
│   │   └── config.json
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── assignmentController.js
│   │   ├── submissionController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── index.js
│   │   ├── user.js
│   │   ├── assignment.js
│   │   └── submission.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── assignmentRoutes.js
│   │   ├── submissionRoutes.js
│   │   └── userRoutes.js
│   ├── utils/
│   │   ├── logger.js
│   │   └── response.js
│   ├── postman/
│   │   └── Assignment_Management_System_API.postman_collection.json
│   ├── .env
│   ├── .gitignore
│   ├── app.js
│   ├── package.json
│   └── README.md

Prerequisites

Node.js (v14 or later)
MongoDB
Postman (for testing APIs)

Setup Instructions

Clone the Repository:
git clone <repository-url>
cd assignment-management-system/backends


Install Dependencies:
npm install


Configure Environment Variables:

Create a .env file in the backends directory and update it with your MongoDB URI:PORT=3000
MONGO_URI=mongodb://localhost:27017/assignment_system
JWT_SECRET=your_jwt_secret_key




Set Up MongoDB:

Ensure MongoDB is installed and running:mongod


The application will seed initial data (lecturer, student1, student2, and an assignment) on startup.


Start the Server:
npm start

The server will run on http://localhost:3000.


API Endpoints

POST /api/auth/login: Authenticate a user and return a JWT token.
GET /api/assignments: Get all assignments (filtered for students).
POST /api/assignments: Create a new assignment (admin only).
GET /api/users: Get all students (admin only).
POST /api/users: Create a new user (admin only).
GET /api/submissions: Get all submissions (filtered for students).
POST /api/submissions: Submit an assignment (student only).

Testing with Postman

Import the Postman collection (postman/Assignment_Management_System_API.postman_collection.json) into Postman.
Set the token variable after running the Login request with username: lecturer and password: admin123.
Update <student1-id> and <assignment-id> in the Create Assignment and Create Submission requests with actual IDs from the database.

Notes

The frontend should run on http://localhost:3001 to avoid port conflicts.
Logs are written to error.log and combined.log in the project root.
Initial data is seeded on startup with lecturer (password: admin123), student1, and student2 (password: student123).

