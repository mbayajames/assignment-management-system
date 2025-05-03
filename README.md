Assignment Management System Backend (MongoDB)
Backend for the Assignment Management System, built with Node.js, Express, and MongoDB, located in the backends directory of the assignment-management-system project.
Prerequisites

Node.js (>= 14.x)
MongoDB (>= 4.x)
Postman (for testing)

Setup

Navigate to backends directory:
cd assignment-management-system/backends


Install dependencies:
npm install


Configure environment variables:

Create backends/.env:PORT=3000
MONGO_URI=mongodb://localhost:27017/assignment_management_system
JWT_SECRET=your_jwt_secret


Replace your_jwt_secret with a secure value.


Set up MongoDB:

Start MongoDB:mongod


The database assignment_management_system and collections (users, assignments, submissions) will be created automatically.


Initialize database with mock data:

Generate bcrypt hashes:const bcrypt = require('bcryptjs');
console.log(bcrypt.hashSync('lecturer123', 10));
console.log(bcrypt.hashSync('student123', 10));


Insert users using MongoDB shell or MongoDB Compass:use assignment_management_system;
db.users.insertMany([
  { username: "lecturer", password: "<hash_for_lecturer123>", role: "admin", createdAt: new Date(), updatedAt: new Date() },
  { username: "student1", password: "<hash_for_student123>", role: "student", createdAt: new Date(), updatedAt: new Date() },
  { username: "student2", password: "<hash_for_student123>", role: "student", createdAt: new Date(), updatedAt: new Date() }
]);




Start the server:
npm start


For development:npm run dev




Test APIs with Postman:

Import backends/postman/Assignment_Management_System_API.postman_collection.json.
Run Login (POST /api/auth/login):{
  "username": "lecturer",
  "password": "lecturer123"
}


Save token, student1Id, student2Id in Postman variables.
Test endpoints, using ObjectIds for assignmentId and submissionId.



API Endpoints

Auth:
POST /api/auth/login - Login and get JWT token


Assignments (require Authorization: Bearer <token>):
GET /api/assignments - Get all assignments (admin: all, student: assigned)
GET /api/assignments/:id - Get assignment by ID
POST /api/assignments - Create assignment (admin only)
PUT /api/assignments/:id - Update assignment (admin only)
DELETE /api/assignments/:id - Delete assignment (admin only)


Submissions (require Authorization: Bearer <token>):
GET /api/submissions - Get all submissions (admin: all, student: own)
GET /api/submissions/:id - Get submission by ID
POST /api/submissions - Create submission (student only)
PUT /api/submissions/:id - Update submission (student only)
DELETE /api/submissions/:id - Delete submission (student only)
PUT /api/submissions/:id/mark - Mark submission (admin only)


Users (require Authorization: Bearer <token>):
POST /api/users - Create user (admin only)
GET /api/users - Get all users (admin only)



Project Structure
assignment-management-system/
├── backends/
│   ├── config/              # Database configuration
│   │   ├── database.js      # MongoDB connection setup
│   │   └── config.json      # Environment-specific configs
│   ├── controllers/         # Request handling logic
│   │   ├── authController.js       # Login and authentication
│   │   ├── assignmentController.js # Assignment CRUD
│   │   ├── submissionController.js # Submission CRUD and marking
│   │   └── userController.js       # User management
│   ├── middleware/          # Custom middleware
│   │   ├── auth.js          # JWT authentication
│   │   └── errorHandler.js  # Error handling
│   ├── models/              # Mongoose schemas
│   │   ├── index.js         # Model initialization
│   │   ├── user.js          # User schema
│   │   ├── assignment.js    # Assignment schema
│   │   └── submission.js    # Submission schema
│   ├── routes/              # API routes
│   │   ├── authRoutes.js        # Auth endpoints
│   │   ├── assignmentRoutes.js  # Assignment endpoints
│   │   ├── submissionRoutes.js  # Submission endpoints
│   │   └── userRoutes.js        # User endpoints
│   ├── utils/               # Helper functions
│   │   ├── logger.js        # Winston logging
│   │   └── response.js      # Response formatting
│   ├── postman/             # Postman collection
│   │   └── Assignment_Management_System_API.postman_collection.json
│   ├── .env                 # Environment variables
│   ├── .gitignore           # Ignored files
│   ├── app.js               # Express server setup
│   ├── package.json         # Backend dependencies and scripts
│   └── README.md            # Backend documentation
├── Frontend/
│   ├── src/                 # Source code
│   │   ├── components/      # React components
│   │   │   ├── Assignment.js    # Assignment management UI
│   │   │   ├── Login.js         # Login form
│   │   │   └── [Other components] # Additional UI components
│   │   ├── services/        # API client
│   │   │   └── api.js       # Axios-based API service
│   │   ├── App.js           # Main app component
│   │   └── index.js         # Entry point
│   ├── public/              # Static assets
│   │   ├── index.html       # HTML template
│   │   └── [Other assets]   # Favicons, images, etc.
│   ├── package.json         # Frontend dependencies and scripts
│   └── README.md            # Frontend documentation

Frontend Integration
The frontend, located in the Frontend directory, is a React-based application that interacts with the backend APIs at http://localhost:3000/api. Below are steps to set up and integrate the frontend:

Navigate to Frontend directory:
cd assignment-management-system/Frontend


Install dependencies:
npm install


Ensure axios is included for API requests:npm install axios




Set up API service (Frontend/src/services/api.js):

This file configures Axios to communicate with the backend, including JWT authentication:import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;




Update React components:

Example for Frontend/src/components/Assignment.js to fetch assignments:import { useState, useEffect } from 'react';
import api from '../services/api';

const Assignment = ({ role, userId }) => {
  const [assignments, setAssignments] = useState([]);
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/assignments');
        const assignmentsData = role === 'admin' ? response.data.data : response.data.data.filter(a => a.assignedTo.some(u => u.id === userId));
        setAssignments(assignmentsData);
        if (role === 'admin') {
          const usersResponse = await api.get('/users');
          setStudents(usersResponse.data.data.filter(u => u.role === 'student'));
        }
      } catch (err) {
        setError('Failed to load data. Please try refreshing the page.');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [role, userId]);

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <ul>
        {assignments.map(assignment => (
          <li key={assignment.id}>{assignment.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default Assignment;




Run the frontend:

Update Frontend/package.json to use port 3001:"scripts": {
  "start": "PORT=3001 react-scripts start",
  "build": "react-scripts build",
  "test": "react-scripts test",
  "eject": "react-scripts eject"
}


Start the frontend:npm start


The frontend will run on http://localhost:3001.


Key frontend files:

Frontend/src/App.js: Main app component, defines routes and layout.
Frontend/src/index.js: Entry point, renders the app.
Frontend/src/components/Login.js: Handles user login, sends POST /api/auth/login requests.
Frontend/src/components/Assignment.js: Displays and manages assignments.
Frontend/public/index.html: HTML template for the React app.


**Test frontend


