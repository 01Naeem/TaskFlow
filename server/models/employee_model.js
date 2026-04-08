const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // BASIC INFO
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
    },

    // ORGANIZATION
    department: {
      type: String,
      required: true,
      enum: ["development", "design", "qa", "marketing"],
    },

    designation: {
      type: String,
      required: true,
      enum: ["uiux", "frontend", "backend", "fullstack", "tester", "devops"],
    },

    // SYSTEM ROLE
    role: {
      type: String,
      default: "employee",
      enum: ["employee", "admin", "manager"],
    },

    // CONTACT
    phone: {
      type: String,
    },

    joiningDate: {
      type: Date,
      default: Date.now,
    },

    // 🔥 CREATED BY (ADMIN INFO)
    createdBy: {
      adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
    },

    // OPTIONAL (future use)
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // 🔥 adds createdAt & updatedAt automatically
  },
);

module.exports = mongoose.model("Employee", userSchema);
