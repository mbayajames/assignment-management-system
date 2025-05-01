BACKEND ASSIGNMENT-MANAGEMENT-SYSTEM

Assignment System API (MongoDB)
A RESTful API for an assignment management system, built with Node.js, Express, MongoDB, and Mongoose.
Prerequisites

Node.js (>= 14.x)
MongoDB (>= 4.x)
Postman (for testing)

Setup

Clone the repository:
git clone <repository-url>
cd assignment-system-api


Install dependencies:
npm install


Configure environment variables:

Create .env file with:PORT=3000
MONGO_URI=mongodb://localhost:27017/assignment_system
JWT_SECRET=your_jwt_secret


Replace your_jwt_secret with a secure value.


Set up MongoDB:

Ensure MongoDB is running locally (mongod) or use a cloud service like MongoDB Atlas.
The database assignment_system will be created automatically by Mongoose.


Initialize database with mock data:

Use MongoDB Compass, mongo shell, or a script to insert initial users:const bcrypt = require('bcryptjs');
const users = [
  { username: 'lecturer', password: bcrypt.hashSync('lecturer123', 10), role: 'admin' },
  { username: 'student1', password: bcrypt.hashSync('student123', 10), role: 'student' },
  { username: 'student2', password: bcrypt.hashSync('student123', 10), role: 'student' }
];
// Insert into MongoDB (e.g., via mongoose or mongo shell)
db.users.insertMany(users);


Example mongo shell command:use assignment_system
db.users.insertMany([
  { username: "lecturer", password: "<bcrypt_hash_for_lecturer123>", role: "admin", createdAt: new Date(), updatedAt: new Date() },
  { username: "student1", password: "<bcrypt_hash_for_student123>", role: "student", createdAt: new Date(), updatedAt: new Date() },
  { username: "student2", password: "<bcrypt_hash_for_student123>", role: "student", createdAt: new Date(), updatedAt: new Date() }
])




Start the server:
npm start


For development with auto-restart:npm run dev




Test APIs with Postman:

Import postman/Assignment_System_API.postman_collection.json into Postman.
Run the Login request (POST /api/auth/login) to get a JWT token.
Save the token in the token variable and test other endpoints.
Note: Update assignmentId and other IDs in Postman to valid MongoDB ObjectIds after creating data.



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
PUT /api/submissions/:id/mark - Mark submission as correct/incorrect (admin only)


Users (require Authorization: Bearer <token>):
POST /api/users - Create user (admin only)
GET /api/users - Get all users (admin only)



Project Structure
assignment-system-api/
├── config/              # Database and environment configuration
├── controllers/         # Request handling logic
├── middleware/          # Custom middleware (auth, error handling)
├── models/              # Mongoose schemas
├── routes/              # API routes
├── utils/               # Helper functions (logger, responses)
├── postman/             # Postman collection for testing
├── .env                 # Environment variables
├── .gitignore           # Git ignore file
├── app.js               # Main server file
├── package.json         # Dependencies and scripts
└── README.md            # Project documentation

Integration with Frontend

Update the frontend to use http://localhost:3000/api as the base URL.
Add an API service (e.g., using axios):import axios from 'axios';

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


Install axios: npm install axios in the frontend directory.
Update components (Assignment.js, Submissions.js, ManageUsers.js) to use API calls.
Note: MongoDB uses _id (ObjectId) instead of id. Update frontend to handle _id fields (e.g., assignment._id instead of assignment.id).

Notes

Passwords are hashed with bcrypt.
Use environment variables for sensitive data.
Test all endpoints with Postman before frontend integration.
The mock data matches the frontend: lecturer (admin), student1, student2 (students).
Winston logging is used for debugging, error tracking, and auditing (see utils/logger.js).

Troubleshooting

MongoDB connection issues: Ensure MongoDB is running (mongod) and MONGO_URI is correct.
Port conflicts: Change PORT in .env if 3000 is in use.
Mongoose errors: Verify MongoDB version compatibility (npm list mongoose).
JWT errors: Ensure JWT_SECRET is set and token is sent as Bearer <token>.
ObjectId issues: Use valid MongoDB ObjectIds in Postman requests.

