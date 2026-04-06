const mongoose = require("mongoose");

let isConnected = false; // prevent multiple connections

const connectDataBase = async (retries = 5) => {
  try {
    if (isConnected) {
      console.log("🟡 MongoDB already connected. Skipping reconnection.");
      return;
    }

    // 🔍 Validate ENV
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    // ⚡ Connect
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    isConnected = true;

    // ✅ Clean structured log
    console.log(`
🟢 MongoDB CONNECTION ESTABLISHED
══════════════════════════════════
Host        : ${conn.connection.host}
Database    : ${conn.connection.name}
Env         : ${process.env.NODE_ENV || "development"}
Mongoose Ver: ${mongoose.version}
══════════════════════════════════
    `);
  } catch (error) {
    console.error(`
🔴 MongoDB CONNECTION FAILED
════════════════════════════
Error : ${error.message}
Retries left: ${retries}
════════════════════════════
    `);

    // 🔁 Retry logic (important in production)
    if (retries > 0) {
      console.log("🔄 Retrying DB connection in 5 seconds...");
      setTimeout(() => connectDataBase(retries - 1), 5000);
    } else {
      console.error("❌ All retries exhausted. Exiting process.");
      process.exit(1);
    }
  }
};

// 📡 Attach listeners ONCE (outside function)
mongoose.connection.on("connected", () => {
  console.log("🟢 Mongoose connected");
});

mongoose.connection.on("error", (err) => {
  console.error("🔴 Mongoose error:", err.message);
});

mongoose.connection.on("disconnected", () => {
  console.warn("🟡 Mongoose disconnected");
});

// 🛑 Graceful shutdown (production-grade)
const gracefulShutdown = async (signal) => {
  console.log(`\n⚠️ Received ${signal}. Closing DB connection...`);
  try {
    await mongoose.connection.close();
    console.log("🛑 MongoDB connection closed successfully");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error during DB shutdown:", err.message);
    process.exit(1);
  }
};

// Handle multiple termination signals
["SIGINT", "SIGTERM", "SIGQUIT"].forEach((signal) => {
  process.on(signal, gracefulShutdown);
});

module.exports = connectDataBase;
