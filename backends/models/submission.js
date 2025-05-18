const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assignment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' },
  file: String,
  grade: String,
  feedback: String,
}, { timestamps: true });

module.exports = mongoose.model('Submission', submissionSchema);
