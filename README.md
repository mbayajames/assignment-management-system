Assignment System API
A RESTful API for an assignment management system, built with Node.js, Express, MySQL, and Sequelize.
Prerequisites

Node.js (>= 14.x)
MySQL (>= 8.x)
Postman (for testing)

Setup

Clone the repository:
git clone <repository-url>
cd assignment-system-api


Install dependencies:
npm install


Configure environment variables:

Copy .env.example to .env and update with your MySQL credentials and JWT secret.

cp .env.example .env


Set up MySQL database:

Create a database named assignment_system:CREATE DATABASE assignment_system;


Sequelize will create tables on startup.


Initialize database with mock data:

Run the following SQL to create initial users:INSERT INTO users (username, password, role, createdAt, updatedAt) VALUES
('lecturer', '$2a$10$X./4zX6z5u5Qz6Qz6Qz6Qz6Qz6Qz6Qz6Qz6Qz6Qz6Qz6Qz6Qz6Qz', 'admin', NOW(), NOW()),
('student1', '$2a$10$X./4zX6z5u5Qz6Qz6Qz6Qz6Qz6Qz6Qz6Qz6Qz6Qz6Qz6Qz6Qz6Qz', 'student', NOW(), NOW()),
('student2', '$2a$10$X./4zX6z5u5Qz6Qz6Qz6Qz6Qz6Qz6Qz6Qz6Qz6Qz6Qz6Qz6Qz6Qz', 'student', NOW(), NOW());


Note: The password hash corresponds to lecturer123 and student123 (use bcrypt to generate).


Start the server:
npm start


For development with auto-restart:npm run dev




Test APIs with Postman:

Import postman/Assignment_System_API.postman_collection.json into Postman.
Run the Login request to get a JWT token.
Set the token in the token variable and test other endpoints.



API Endpoints

Auth:
POST /api/auth/login - Login and get JWT token


Assignments (require Authorization: Bearer token):
GET /api/assignments - Get all assignments (admin: all, student: assigned)
GET /api/assignments/:id - Get assignment by ID
POST /api/assignments - Create assignment (admin only)
PUT /api/assignments/:id - Update assignment (admin only)
DELETE /api/assignments/:id - Delete assignment (admin only)


Submissions (require Authorization: Bearer token):
GET /api/submissions - Get all submissions (admin: all, student: own)
GET /api/submissions/:id - Get submission by ID
POST /api/submissions - Create submission (student only)
PUT /api/submissions/:id - Update submission (student only)
DELETE /api/submissions/:id - Delete submission (student only)
PUT /api/submissions/:id/mark - Mark submission (admin only)


Users (require Authorization: Bearer token):
POST /api/users - Create user (admin only)
GET /api/users - Get all users (admin only)



Project Structure
assignment-system-api/
├── config/              # Database and environment configuration
├── controllers/         # Request handling logic
├── middleware/          # Custom middleware (auth, error handling)
├── models/              # Sequelize models
├── routes/              # API routes
├── utils/               # Helper functions (logger, responses)
├── postman/             # Postman collection for testing
├── .env                 # Environment variables
├── .gitignore           # Git ignore file
├── app.js               # Main server file
├── package.json         # Dependencies and scripts
└── README.md            # Project documentation

Integration with Frontend

Update the frontend (src/index.js or API service) to use http://localhost:3000/api as the base URL.
Ensure the frontend sends Authorization: Bearer <token> for authenticated requests.
Handle API responses (e.g., status, message, data) in the frontend.

Notes

Passwords are hashed with bcrypt.
Use environment variables for sensitive data.
Test all endpoints with Postman before frontend integration.

Troubleshooting

MySQL connection issues: Ensure MySQL is running and .env credentials are correct.
Port conflicts: Change PORT in .env if 3000 is in use.
Sequelize errors: Verify database exists and Sequelize version matches.
JWT errors: Ensure JWT_SECRET is set and token is sent correctly.

