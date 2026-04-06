const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    // 🔹 BASIC INFO
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },

    // 🔹 TASK META
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    status: {
      type: String,
      enum: ["in-progress", "submitted", "completed"],
      default: "in-progress",
    },

    dueDate: { type: Date },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      index: true, // 🔥 improves query performance
    },

    // ⭐ IMPORTANT FLAG
    important: {
      type: Boolean,
      default: false,
    },

    // 📊 PROGRESS
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    // 💬 COMMENTS / NOTES
    notes: [
      {
        text: { type: String, required: true },

        addedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Employee",
        },

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // 🧑‍💼 CREATED BY ADMIN
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },

    // 🔁 ACTIVITY LOG (IMPROVED)
    activity: [
      {
        action: {
          type: String,
          required: true,
        },

        performedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Employee",
        },

        metadata: {
          type: Object, // 🔥 flexible (store old/new values)
        },

        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true, // ✅ handles createdAt & updatedAt automatically
  },
);

module.exports = mongoose.model("Task", TaskSchema);
