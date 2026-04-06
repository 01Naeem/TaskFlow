const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 3,
      maxlength: 50,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\S+@\S+\.\S+$/,
        "Please use a valid email address",
      ],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false, // 🔒 hide password in queries
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

// 🔐 Optional: Index for performance
adminSchema.index({ email: 1 });

// 📦 Export Model
module.exports = mongoose.model("Admin", adminSchema);