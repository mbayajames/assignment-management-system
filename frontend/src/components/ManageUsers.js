import React, { useState, useEffect } from "react";
import { FaUserPlus } from "react-icons/fa";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Mock data
  const mockUsers = [
    { id: 2, username: "student1", role: "student" },
    { id: 3, username: "student2", role: "student" },
  ];
  let nextUserId = 4;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        // Simulate async data fetch
        await new Promise((resolve) => setTimeout(resolve, 500));
        setUsers(mockUsers);
      } catch (err) {
        setError("Failed to load users. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const validateForm = () => {
    if (!newUser.username || !newUser.password) {
      setError("All fields are required");
      return false;
    }

    if (newUser.password !== newUser.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    if (newUser.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }

    if (users.some((user) => user.username === newUser.username)) {
      setError("Username already exists");
      return false;
    }

    return true;
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!validateForm()) return;

    try {
      setLoading(true);
      // Simulate async operation
      await new Promise((resolve) => setTimeout(resolve, 500));
      const addedUser = {
        id: nextUserId++,
        username: newUser.username,
        role: "student",
      };
      mockUsers.push(addedUser);
      setUsers([...users, addedUser]);
      setNewUser({ username: "", password: "", confirmPassword: "" });
      setSuccessMessage("User added successfully!");
    } catch (err) {
      setError("Failed to add user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section">
      <h2>Manage Users</h2>

      {error && <div className="alert error">{error}</div>}
      {successMessage && <div className="alert success">{successMessage}</div>}

      <form onSubmit={handleAddUser} className="form-container">
        <h3>Add New Student</h3>

        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={newUser.username}
            onChange={(e) =>
              setNewUser({ ...newUser, username: e.target.value })
            }
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={newUser.password}
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value })
            }
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            value={newUser.confirmPassword}
            onChange={(e) =>
              setNewUser({ ...newUser, confirmPassword: e.target.value })
            }
            disabled={loading}
          />
        </div>

        <button type="submit" className="primary-button" disabled={loading}>
          {loading ? (
            "Adding Student..."
          ) : (
            <>
              <FaUserPlus /> Add Student
            </>
          )}
        </button>
      </form>

      {loading ? (
        <div className="loading">Loading users...</div>
      ) : (
        <UserTable users={users} />
      )}
    </div>
  );
};

const UserTable = ({ users }) => (
  <div className="table-container">
    <table>
      <thead>
        <tr>
          <th>Username</th>
          <th>Role</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>{user.username}</td>
            <td>{user.role}</td>
          </tr>
        ))}
      </tbody>
    </table>
    {users.length === 0 && <div className="no-users">No users found</div>}
  </div>
);

export default ManageUsers;
