Assignment Management System
Overview
This is a full-stack Assignment Management System built with a Node.js/Express/MongoDB backend and a React frontend. The backend serves both the API and the frontend on http://localhost:3000.
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
│   ├── app.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.js
│   │   │   ├── LoadingSpinner.js
│   │   │   ├── Login.js
│   │   │   ├── Sidebar.js
│   │   │   ├── Assignment.js
│   │   │   ├── ManageUsers.js
│   │   │   └── Submissions.js
│   │   ├── Dashboard.js
│   │   ├── App.js
│   │   ├── index.js
│   │   ├── styles.css
│   │   └── index.css
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.ico
│   ├── package.json
│   └── README.md
├── .gitignore
└── README.md

Prerequisites

Node.js (v14 or later)
MongoDB
Postman (for testing APIs)

Setup Instructions

Clone the Repository:
git clone <repository-url>
cd assignment-management-system


Set Up the Backend:

Navigate to the backend directory:cd backends


Install dependencies:npm install


Configure environment variables by creating a .env file:PORT=3000
MONGO_URI=mongodb://localhost:27017/assignment_system
JWT_SECRET=your_jwt_secret_key

Replace your_jwt_secret_key with a secure key (e.g., mysecretkey123).


Set Up the Frontend:

Navigate to the frontend directory:cd ../frontend


Install dependencies:npm install


Build the frontend:npm run build




Set Up MongoDB:

Ensure MongoDB is installed and running:mongod


The application will seed initial data (lecturer, student1, student2, and an assignment) on startup.


Start the Application:

From the backends directory, start the server:cd ../backends
npm start


Access the application at http://localhost:3000.



API Endpoints

POST /api/auth/login: Authenticate a user and return a JWT token.
GET /api/assignments: Get all assignments (filtered for students).
POST /api/assignments: Create a new assignment (admin only).
GET /api/users: Get all students (admin only).
POST /api/users: Create a new user (admin only).
GET /api/submissions: Get all submissions (filtered for students).
POST /api/submissions: Submit an assignment (student only).

Testing with Postman

Import the Postman collection (backends/postman/Assignment_Management_System_API.postman_collection.json) into Postman.
Set the token variable after running the Login request with username: lecturer and password: admin123.
Update <student1-id> and <assignment-id> in the Create Assignment and Create Submission requests with actual IDs from the database.

Features

Login: Users can log in as either an admin (lecturer, password: admin123) or a student (student1 or student2, password: student123).
Assignments:
Students can view assignments assigned to them.
Admins can view all assignments and create new ones.


Submissions:
Students can submit assignments by providing a file URL.
Admins can view all submissions (edit/mark/delete functionality is not yet supported).


Manage Users:
Admins can view and add students.



Notes

The application runs on http://localhost:3000, with the backend serving both the API and the frontend.
Logs are written to error.log and combined.log in the backends directory.
Initial data is seeded on startup with lecturer (password: admin123), student1, and student2 (password: student123).
To enable marking, editing, or deleting submissions, additional backend endpoints are needed (e.g., PATCH /api/submissions/:id, DELETE /api/submissions/:id).

