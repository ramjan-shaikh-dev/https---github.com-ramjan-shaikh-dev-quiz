const db = require("../config/db");

const getLeaderboard = async (req, res) => {
  try {
    const [results] = await db.execute(`
      SELECT
        u.id,
        u.name,
        MAX(qr.score) AS score
      FROM quiz_results qr
      JOIN users u
      ON qr.user_id = u.id
      GROUP BY u.id, u.name
      ORDER BY score DESC
      LIMIT 10
    `);

    res.json({
      success: true,
      results,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Error fetching leaderboard",
    });
  }
};
// Save Quiz Result
const saveResult = async (req, res) => {
  try {
    const { userId, score, totalQuestions } = req.body;

    if (!userId || score === undefined || !totalQuestions) {
      return res.status(400).json({
        success: false,
        message: "userId, score and totalQuestions are required",
      });
    }

    await db.execute(
      `
      INSERT INTO quiz_results
      (user_id, score, total_questions)
      VALUES (?, ?, ?)
      `,
      [userId, score, totalQuestions]
    );

    res.json({
      success: true,
      message: "Result Saved Successfully",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Error saving result",
    });
  }
};

// Get Result History
const getResults = async (req, res) => {
  try {
    const { userId } = req.params;

    const [results] = await db.execute(
      `
      SELECT *
      FROM quiz_results
      WHERE user_id = ?
      ORDER BY created_at DESC
      `,
      [userId]
    );

    res.json({
      success: true,
      results,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Error fetching results",
    });
  }
};

module.exports = {
  saveResult,
  getResults,
  getLeaderboard,
};