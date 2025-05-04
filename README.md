Assignment Management System Frontend
Overview
This is the frontend for the Assignment Management System, built with React. It provides a user interface for managing assignments, submissions, and users. The frontend is served by the backend on http://localhost:3000.
Project Structure
frontend/
├── src/
│   ├── components/
│   │   ├── Header.js
│   │   ├── LoadingSpinner.js
│   │   ├── Login.js
│   │   ├── Sidebar.js
│   │   ├── Assignment.js
│   │   ├── ManageUsers.js
│   │   └── Submissions.js
│   ├── Dashboard.js
│   ├── App.js
│   ├── index.js
│   ├── styles.css
│   └── index.css
├── public/
│   ├── index.html
│   └── favicon.ico
├── package.json
└── README.md

Prerequisites

Node.js (v14 or later)
The backend must be set up and running (see ../backends/README.md).

Setup Instructions

Navigate to the Frontend Directory:
cd assignment-management-system/frontend


Install Dependencies:
npm install


Build the Frontend:
npm run build

This will generate the build directory with static files, which the backend will serve.

Run the Application:

The frontend does not need to be run separately since it is served by the backend.
Navigate to the backend directory (../backends) and start the backend:cd ../backends
npm start


Access the application at http://localhost:3000.



Development
To develop the frontend independently (e.g., for live reloading):

Start the Frontend Development Server:
cd frontend
npm start

This will run the frontend on http://localhost:3001. However, you may encounter CORS issues since the backend is on http://localhost:3000.

Proxy Setup (Optional):To avoid CORS issues during development, add a proxy to package.json:
"proxy": "http://localhost:3000"

Then restart the development server.

Build and Test:After making changes, rebuild the frontend (npm run build) and restart the backend to see the updates.


Features

Login: Users can log in as either an admin (lecturer, password: admin123) or a student (student1 or student2, password: student123).
Assignments:
Students can view assignments assigned to them.
Admins can view all assignments and create new ones, assigning them to students.


Submissions:
Students can submit assignments by providing a file URL.
Admins can view all submissions (edit/mark/delete functionality is not yet supported by the backend).


Manage Users:
Admins can view all students and add new students.


Responsive Design: The UI is responsive and works on both desktop and mobile devices.

Notes

The frontend is served by the backend on http://localhost:3000.
The Submissions component has features (marking, editing, deleting) that are not yet supported by the backend. Additional backend endpoints are needed to enable these features.
Styles are defined in styles.css and are responsive for various screen sizes.







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

