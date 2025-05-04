module.exports = (mongoose) => {
  const submissionSchema = new mongoose.Schema({
    assignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fileUrl: { type: String, required: true },
    submittedAt: { type: Date, default: Date.now },
  });

  return mongoose.model("Submission", submissionSchema);
};
