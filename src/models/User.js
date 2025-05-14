import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  department: {
    type: String,
    required: function () {
      return this.role !== "director"; // Required for all roles except director
    },
  },
  role: { type: String, required: true, lowercase: true },
  rollNumber: {
    type: String,
    validate: {
      validator: function (value) {
        if (this.role === "student" && !value) {
          return false; // Roll number is required for students
        }
        if (this.role !== "student" && value) {
          return false; // Roll number must be absent for non-students
        }
        return true;
      },
      message: "Invalid roll number field",
    },
  },
  projectTitle: {
    type: String,
    required: function () {
      return this.role?.toLowerCase() === 'student';
    },
  },
  supervisor: {
    type: String,
    required: function () {
      return this.role?.toLowerCase() === 'student';
    },
  },
  
  isVerified: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
  forgotPasswordToken: String,
  forgotPasswordTokenExpiry: Date,
  verifyToken: String,
  verifyTokenExpiry: Date,
  createdAt: { type: Date, default: Date.now },
});

// Prevent saving `rollNumber` for non-students
userSchema.pre("save", function (next) {
  if (this.role !== "student") {
    this.rollNumber = undefined;
  }
  next();
});

// Prevent saving `department` for directors
userSchema.pre("save", function (next) {
  if (this.role === "director") {
    this.department = undefined;
  }
  next();
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
