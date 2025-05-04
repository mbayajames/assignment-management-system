module.exports = (mongoose) => {
  const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "student"], required: true },
  });

  return mongoose.model("User", userSchema);
};
