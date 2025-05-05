module.exports = (mongoose) => {
  const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "student"], required: true },
    resetToken: { type: String },
    resetTokenExpiry: { type: Date },
  });

  return mongoose.model("User", userSchema);
};
