const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./config/db");

const authRoutes = require("./routes/1.0/authRoutes");
const questionsRoutes = require("./routes/questions.Routes");
const quizRoutes = require("./routes/quizRoutes");
const reasultRoutes = require("./routes/reasultRoutes");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Quiz API is running",
  });
});

// Authentication APIs
app.use("/api/1.0", authRoutes);
// Quiz Questions APIs
app.use("/api/1.0/questions", questionsRoutes);
app.use("/api/1.0/quiz", quizRoutes);
app.use("/api/1.0/reasults", reasultRoutes);
async function startServer() {
  try {
    await db.query("SELECT 1");

    console.log("Connected to MySQL database");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error(
      "Could not connect to MySQL database:",
      error.message
    );

    process.exit(1);
  }
}

startServer();