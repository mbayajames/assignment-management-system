import React, { useState, useEffect } from 'react';
import { FaPlus, FaBookOpen, FaFileAlt, FaExclamationCircle, FaCheckCircle, FaUser } from 'react-icons/fa';
import LoadingSpinner from './LoadingSpinner';

const Assignment = ({ role, userId }) => {
  const [assignments, setAssignments] = useState([]);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    dueDate: '',
    assignedTo: [],
  });
  const [students, setStudents] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Mock data
  const mockData = {
    assignments: [
      { id: 1, title: 'Math Assignment', description: 'Solve problems 1-10', dueDate: '2025-05-01', assignedTo: [2, 3] },
      { id: 2, title: 'Science Project', description: 'Create a model', dueDate: '2025-05-10', assignedTo: [2] },
    ],
    users: [
      { id: 2, username: 'student1', role: 'student' },
      { id: 3, username: 'student2', role: 'student' },
    ],
  };
  let nextAssignmentId = 3;

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Simulate async data fetch
        await new Promise((resolve) => setTimeout(resolve, 500));
        const assignmentsData =
          role === 'admin'
            ? mockData.assignments
            : mockData.assignments.filter((a) => a.assignedTo.includes(userId));
        setAssignments(assignmentsData);

        if (role === 'admin') {
          setStudents(mockData.users);
        }
      } catch (err) {
        setError('Failed to load data. Please try refreshing the page.');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [role, userId]);

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Simulate async operation
      await new Promise((resolve) => setTimeout(resolve, 500));
      const createdAssignment = {
        id: nextAssignmentId++,
        title: newAssignment.title,
        description: newAssignment.description,
        dueDate: newAssignment.dueDate,
        assignedTo: newAssignment.assignedTo,
      };
      mockData.assignments.push(createdAssignment);
      setAssignments([...assignments, createdAssignment]);
      setNewAssignment({ title: '', description: '', dueDate: '', assignedTo: [] });
    } catch (err) {
      setError('Failed to create assignment. Please check your inputs and try again.');
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading) return <LoadingSpinner />;
  if (error)
    return (
      <div className="section error">
        <FaExclamationCircle /> {error}
      </div>
    );

  return (
    <div className="section">
      <h2>
        <FaBookOpen /> Assignments
      </h2>
      {error && (
        <div className="error-message">
          <FaExclamationCircle /> {error}
        </div>
      )}

      {role === 'admin' && (
        <form onSubmit={handleCreateAssignment} className="assignment-form">
          <h3>
            <FaPlus /> Create New Assignment
          </h3>
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
              onChange={(e) =>
                setNewAssignment({
                  ...newAssignment,
                  assignedTo: Array.from(e.target.selectedOptions, (option) => parseInt(option.value)),
                })
              }
              required
            >
              {students.map((student) => (
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
                <th>
                  <FaFileAlt /> Title
                </th>
                <th>
                  <FaFileAlt /> Description
                </th>
                <th>
                  <FaCheckCircle /> Due Date
                </th>
                {role === 'admin' && (
                  <th>
                    <FaUser /> Assigned To
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {assignments.map((assignment) => (
                <tr key={assignment.id}>
                  <td>{assignment.title}</td>
                  <td>{assignment.description}</td>
                  <td>{formatDate(assignment.dueDate)}</td>
                  {role === 'admin' && (
                    <td>
                      {students
                        .filter((student) => assignment.assignedTo.includes(student.id))
                        .map((student) => student.username)
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