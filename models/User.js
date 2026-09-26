import mongoose from "mongoose";

// User schema - Adopter, Shelter, Admin sob ei ekta model e thakbe, role diye alada kora hobe
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["adopter", "shelter", "admin"],
      default: "adopter",
    },
    isVerified: {
      type: Boolean,
      default: false, // shelter accounts admin verify kora lagbe pore
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
