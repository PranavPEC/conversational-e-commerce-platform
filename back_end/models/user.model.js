import mongoose, { trusted } from "mongoose";
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: "user",
  },
  profileImage: {
    type: String,
    required: false
  },
  otp: {
    type: String,
    required: false
  },
  otpExpiry: {
    type: Date,
    required: false
  },
  otpSentAt: {
    type: Date,
    required: false,
  },
  otpAttempts: {
    type: Number,
    default: 0,
  },
  resetToken: {
    type: String,
    required: false,
  },

  resetTokenExpiry: {
    type: Date,
    required: false,
  },
  phone: {
    type: String,
    required: false,
  },
  dateOfBirth: {
    type: Date,
    required: false
  },
  gender: {
    type: String,
    required: false
  }
}, {
  timestamps: true
})
let User = mongoose.model("User", userSchema);
export default User;