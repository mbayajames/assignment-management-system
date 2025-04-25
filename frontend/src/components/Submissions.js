import React, { useState, useEffect } from 'react';
import { FaUpload, FaCheck, FaTimes, FaEdit, FaTrash } from 'react-icons/fa';
import axios from 'axios';

const API_URL = 'http://localhost:4000'; // Changed from 5000 to 4000

const Submissions = ({ role, userId }) => {
  const [submissions, setSubmissions] = useState([]);
  const [newSubmission, setNewSubmission] = useState({ assignmentId: '', content: '' });
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingSubmissionId, setEditingSubmissionId] = useState(null);
  const [editedContent, setEditedContent] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError('');
      try {
        // Fetch submissions
        const submissionsResponse = role === 'admin'
          ? await axios.get(`${API_URL}/submissions`)
          : await axios.get(`${API_URL}/submissions?studentId=${userId}`);
        setSubmissions(submissionsResponse.data);
        
        // Fetch assignments for students
        if (role === 'student') {
          const assignmentsResponse = await axios.get(`${API_URL}/assignments?assignedTo_like=${userId}`);
          setAssignments(assignmentsResponse.data);
        }
      } catch (err) {
        setError('Failed to load data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [role, userId]);

  const handleSubmitAssignment = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await axios.post(`${API_URL}/submissions`, {
        assignmentId: parseInt(newSubmission.assignmentId),
        studentId: userId,
        content: newSubmission.content,
        submittedAt: new Date().toISOString().split('T')[0],
        status: 'pending'
      });
      
      setSubmissions(prev => [...prev, response.data]);
      setNewSubmission({ assignmentId: '', content: '' });
    } catch (err) {
      setError('Submission failed. Please try again.');
    }
  };

  const handleMarkSubmission = async (submissionId, status) => {
    try {
      const response = await axios.patch(`${API_URL}/submissions/${submissionId}`, { status });
      setSubmissions(prev =>
        prev.map(sub => (sub.id === submissionId ? response.data : sub))
      );
      setError('');
    } catch (err) {
      setError('Failed to update submission status. Please try again.');
    }
  };

  const handleEditSubmission = async (submissionId) => {
    try {
      const response = await axios.patch(`${API_URL}/submissions/${submissionId}`, { content: editedContent });
      setSubmissions(prev =>
        prev.map(sub => (sub.id === submissionId ? response.data : sub))
      );
      setEditingSubmissionId(null);
      setEditedContent('');
      setError('');
    } catch (err) {
      setError('Failed to update submission. Please try again.');
    }
  };

  const handleDeleteSubmission = async (submissionId) => {
    if (window.confirm('Are you sure you want to delete this submission?')) {
      try {
        await axios.delete(`${API_URL}/submissions/${submissionId}`);
        setSubmissions(prev => prev.filter(sub => sub.id !== submissionId));
        setError('');
      } catch (err) {
        setError('Failed to delete submission. Please try again.');
      }
    }
  };

  const startEditing = (submission) => {
    setEditingSubmissionId(submission.id);
    setEditedContent(submission.content);
  };

  const cancelEditing = () => {
    setEditingSubmissionId(null);
    setEditedContent('');
  };

  if (isLoading) return <div className="section">Loading...</div>;
  if (error) return <div className="section error">{error}</div>;

  return (
    <div className="section">
      <h2>Submissions</h2>
      
      {role === 'student' && (
        <form onSubmit={handleSubmitAssignment} className="form-container">
          <h3>Submit Assignment</h3>
          <div>
            <label>Assignment</label>
            <select
              value={newSubmission.assignmentId}
              onChange={(e) => setNewSubmission({ ...newSubmission, assignmentId: e.target.value })}
              required
            >
              <option value="">Select Assignment</option>
              {assignments.map(assignment => (
                <option key={assignment.id} value={assignment.id}>
                  {assignment.title} (Due: {assignment.dueDate})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Submission Content</label>
            <textarea
              value={newSubmission.content}
              onChange={(e) => setNewSubmission({ ...newSubmission, content: e.target.value })}
              required
              rows="4"
            />
          </div>
          <button type="submit" className="submit-button">
            <FaUpload /> Submit
          </button>
        </form>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Assignment ID</th>
              {role === 'admin' && <th>Student ID</th>}
              <th>Content</th>
              <th>Submitted At</th>
              <th>Status</th>
              {role === 'admin' && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {submissions.length > 0 ? (
              submissions.map(submission => (
                <tr key={submission.id}>
                  <td>{submission.assignmentId}</td>
                  {role === 'admin' && <td>{submission.studentId}</td>}
                  <td>
                    {editingSubmissionId === submission.id ? (
                      <div>
                        <textarea
                          value={editedContent}
                          onChange={(e) => setEditedContent(e.target.value)}
                          rows="4"
                          style={{ width: '100%' }}
                        />
                        <div style={{ marginTop: '10px' }}>
                          <button
                            className="primary-button"
                            style={{ padding: '8px 15px', marginRight: '10px' }}
                            onClick={() => handleEditSubmission(submission.id)}
                            disabled={!editedContent.trim()}
                          >
                            Save
                          </button>
                          <button
                            className="primary-button"
                            style={{ padding: '8px 15px' }}
                            onClick={cancelEditing}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      submission.content
                    )}
                  </td>
                  <td>{submission.submittedAt}</td>
                  <td>
                    {submission.status === 'correct' && <span style={{ color: '#2e7d32' }}>✓ Correct</span>}
                    {submission.status === 'incorrect' && <span style={{ color: '#d32f2f' }}>✗ Incorrect</span>}
                    {submission.status === 'pending' && <span style={{ color: '#666666' }}>Pending</span>}
                  </td>
                  {role === 'admin' && (
                    <td>
                      <button
                        className="primary-button"
                        style={{ marginRight: '10px', padding: '8px 15px' }}
                        onClick={() => handleMarkSubmission(submission.id, 'correct')}
                        disabled={submission.status === 'correct' || editingSubmissionId === submission.id}
                      >
                        <FaCheck /> Mark Correct
                      </button>
                      <button
                        className="primary-button"
                        style={{ marginRight: '10px', padding: '8px 15px' }}
                        onClick={() => handleMarkSubmission(submission.id, 'incorrect')}
                        disabled={submission.status === 'incorrect' || editingSubmissionId === submission.id}
                      >
                        <FaTimes /> Mark Incorrect
                      </button>
                      <button
                        className="primary-button"
                        style={{ marginRight: '10px', padding: '8px 15px' }}
                        onClick={() => startEditing(submission)}
                        disabled={editingSubmissionId === submission.id}
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        className="primary-button"
                        style={{ padding: '8px 15px' }}
                        onClick={() => handleDeleteSubmission(submission.id)}
                        disabled={editingSubmissionId === submission.id}
                      >
                        <FaTrash /> Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={role === 'admin' ? 6 : 5}>No submissions found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Submissions;