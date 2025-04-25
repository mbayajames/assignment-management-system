import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';

// Mock API for assignments
const mockApi = {
  getUsers: () => Promise.resolve([
    { id: 2, username: 'student1', role: 'student' },
    { id: 3, username: 'student2', role: 'student' },
  ]),
  getAssignments: (role, userId) => {
    const allAssignments = [
      { id: 1, title: 'Math Assignment 1', description: 'Solve 10 algebra problems', dueDate: '2025-05-01', assignedTo: [2, 3] },
    ];
    if (role === 'admin') return Promise.resolve(allAssignments);
    return Promise.resolve(allAssignments.filter(a => a.assignedTo.includes(userId)));
  },
  createAssignment: (title, description, dueDate, assignedTo) => Promise.resolve({
    id: 2,
    title,
    description,
    dueDate,
    assignedTo,
  }),
};

const Assignment = ({ role, userId }) => {
  const [assignments, setAssignments] = useState([]);
  const [newAssignment, setNewAssignment] = useState({ 
    title: '', 
    description: '', 
    dueDate: '', 
    assignedTo: [] 
  });
  const [students, setStudents] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const assignmentsData = await mockApi.getAssignments(role, userId);
        setAssignments(assignmentsData);
        if (role === 'admin') {
          const users = await mockApi.getUsers();
          setStudents(users);
        }
      } catch (err) {
        setError('Failed to load data. Please try refreshing the page.');
      }
    };
    loadData();
  }, [role, userId]);

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    try {
      const createdAssignment = await mockApi.createAssignment(
        newAssignment.title,
        newAssignment.description,
        newAssignment.dueDate,
        newAssignment.assignedTo
      );
      setAssignments([...assignments, createdAssignment]);
      setNewAssignment({ title: '', description: '', dueDate: '', assignedTo: [] });
      setError('');
    } catch (err) {
      setError('Failed to create assignment. Please check your inputs and try again.');
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="section">
      <h2>Assignment</h2>
      {error && <div className="error-message">{error}</div>}

      {role === 'admin' && (
        <form onSubmit={handleCreateAssignment} className="assignment-form">
          <h3>Create New Assignment</h3>
          <div className="form-group">
            <label>Title:</label>
            <input
              type="text"
              value={newAssignment.title}
              onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Description:</label>
            <textarea
              value={newAssignment.description}
              onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Due Date:</label>
            <input
              type="date"
              value={newAssignment.dueDate}
              onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Assign to Students:</label>
            <select
              multiple
              size="4"
              value={newAssignment.assignedTo}
              onChange={(e) => setNewAssignment({
                ...newAssignment,
                assignedTo: Array.from(e.target.selectedOptions, option => parseInt(option.value))
              })}
              required
            >
              {students.map(student => (
                <option key={student.id} value={student.id}>
                  {student.username}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="submit-button">
            <FaPlus className="icon" /> Create Assignment
          </button>
        </form>
      )}

      <div className="assignments-table">
        {assignments.length === 0 ? (
          <p className="no-assignments">No assignments found</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Due Date</th>
                {role === 'admin' && <th>Assigned To</th>}
              </tr>
            </thead>
            <tbody>
              {assignments.map(assignment => (
                <tr key={assignment.id}>
                  <td>{assignment.title}</td>
                  <td>{assignment.description}</td>
                  <td>{formatDate(assignment.dueDate)}</td>
                  {role === 'admin' && (
                    <td>
                      {students
                        .filter(student => assignment.assignedTo.includes(student.id))
                        .map(student => student.username)
                        .join(', ')}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Assignment;