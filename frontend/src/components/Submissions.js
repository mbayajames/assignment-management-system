import React, { useState, useEffect } from 'react';
import {
  FaUpload,
  FaCheck,
  FaTimes,
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaExclamationCircle,
  FaFileAlt,
  FaUser,
} from 'react-icons/fa';
import LoadingSpinner from './LoadingSpinner';

const Submissions = ({ role, userID }) => {
  const [submissions, setSubmissions] = useState([]);
  const [newSubmission, setNewSubmission] = useState({ assignmentId: '', content: '' });
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingSubmissionId, setEditingSubmissionId] = useState(null);
  const [editedContent, setEditedContent] = useState('');

  // Mock data
  const mockData = {
    assignments: [
      { id: 1, title: 'Math Assignment', description: 'Solve problems 1-10', dueDate: '2025-05-01', assignedTo: [2, 3] },
      { id: 2, title: 'Science Project', description: 'Create a model', dueDate: '2025-05-10', assignedTo: [2] },
    ],
    submissions: [
      { id: 1, assignmentId: 1, studentId: 2, content: 'Student 1 submission for Math', submittedAt: '2025-04-25', status: 'pending' },
      { id: 2, assignmentId: 2, studentId: 2, content: 'Student 1 science model', submittedAt: '2025-04-26', status: 'pending' },
    ],
  };
  let nextSubmissionId = 3;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError('');
      try {
        // Simulate async data fetch
        await new Promise((resolve) => setTimeout(resolve, 500));
        const submissionsData =
          role === 'admin'
            ? mockData.submissions
            : mockData.submissions.filter((s) => s.studentId === userID);
        setSubmissions(submissionsData);

        if (role === 'student') {
          const assignmentsData = mockData.assignments.filter((a) => a.assignedTo.includes(userID));
          setAssignments(assignmentsData);
        }
      } catch (err) {
        setError('Failed to load data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [role, userID]);

  const handleSubmitAssignment = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Simulate async operation
      await new Promise((resolve) => setTimeout(resolve, 500));
      const submission = {
        id: nextSubmissionId++,
        assignmentId: parseInt(newSubmission.assignmentId),
        studentId: userID,
        content: newSubmission.content,
        submittedAt: new Date().toISOString().split('T')[0],
        status: 'pending',
      };
      mockData.submissions.push(submission);
      setSubmissions((prev) => [...prev, submission]);
      setNewSubmission({ assignmentId: '', content: '' });
    } catch (err) {
      setError('Submission failed. Please try again.');
    }
  };

  const handleMarkSubmission = async (submissionId, status) => {
    try {
      // Simulate async operation
      await new Promise((resolve) => setTimeout(resolve, 500));
      const updatedSubmission = mockData.submissions.find((s) => s.id === submissionId);
      if (!updatedSubmission) throw new Error('Submission not found');
      updatedSubmission.status = status;
      setSubmissions((prev) =>
        prev.map((sub) => (sub.id === submissionId ? { ...sub, status } : sub))
      );
      setError('');
    } catch (err) {
      setError('Failed to update submission status. Please try again.');
    }
  };

  const handleEditSubmission = async (submissionId) => {
    try {
      // Simulate async operation
      await new Promise((resolve) => setTimeout(resolve, 500));
      const updatedSubmission = mockData.submissions.find((s) => s.id === submissionId);
      if (!updatedSubmission) throw new Error('Submission not found');
      updatedSubmission.content = editedContent;
      setSubmissions((prev) =>
        prev.map((sub) => (sub.id === submissionId ? { ...sub, content: editedContent } : sub))
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
        // Simulate async operation
        await new Promise((resolve) => setTimeout(resolve, 500));
        mockData.submissions = mockData.submissions.filter((s) => s.id !== submissionId);
        setSubmissions((prev) => prev.filter((sub) => sub.id !== submissionId));
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
        <FaFileAlt /> Submissions
      </h2>

      {role === 'student' && (
        <form onSubmit={handleSubmitAssignment} className="form-container">
          <h3>
            <FaUpload /> Submit Assignment
          </h3>
          <div>
            <label>Assignment</label>
            <select
              value={newSubmission.assignmentId}
              onChange={(e) => setNewSubmission({ ...newSubmission, assignmentId: e.target.value })}
              required
            >
              <option value="">Select Assignment</option>
              {assignments.map((assignment) => (
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
              <th>
                <FaFileAlt /> Assignment ID
              </th>
              {role === 'admin' && (
                <th>
                  <FaUser /> Student ID
                </th>
              )}
              <th>
                <FaFileAlt /> Content
              </th>
              <th>
                <FaCheckCircle /> Submitted At
              </th>
              <th>
                <FaCheckCircle /> Status
              </th>
              {role === 'admin' && (
                <th>
                  <FaEdit /> Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {submissions.length > 0 ? (
              submissions.map((submission) => (
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
                        <div style={{ marginTop: '10px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                          <button
                            className="primary-button"
                            style={{ padding: '8px 15px' }}
                            onClick={() => handleEditSubmission(submission.id)}
                            disabled={!editedContent.trim()}
                          >
                            <FaCheckCircle /> Save
                          </button>
                          <button
                            className="primary-button"
                            style={{ padding: '8px 15px' }}
                            onClick={cancelEditing}
                          >
                            <FaTimes /> Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      submission.content
                    )}
                  </td>
                  <td>{submission.submittedAt}</td>
                  <td>
                    {submission.status === 'correct' && (
                      <span style={{ color: '#2e7d32' }}>
                        <FaCheckCircle /> Correct
                      </span>
                    )}
                    {submission.status === 'incorrect' && (
                      <span style={{ color: '#d32f2f' }}>
                        <FaTimes /> Incorrect
                      </span>
                    )}
                    {submission.status === 'pending' && <span style={{ color: '#666666' }}>Pending</span>}
                  </td>
                  {role === 'admin' && (
                    <td>
                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <button
                          className="primary-button"
                          style={{ padding: '8px 15px' }}
                          onClick={() => handleMarkSubmission(submission.id, 'correct')}
                          disabled={submission.status === 'correct' || editingSubmissionId === submission.id}
                        >
                          <FaCheck /> Mark Correct
                        </button>
                        <button
                          className="primary-button"
                          style={{ padding: '8px 15px' }}
                          onClick={() => handleMarkSubmission(submission.id, 'incorrect')}
                          disabled={submission.status === 'incorrect' || editingSubmissionId === submission.id}
                        >
                          <FaTimes /> Mark Incorrect
                        </button>
                        <button
                          className="primary-button"
                          style={{ padding: '8px 15px' }}
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
                      </div>
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