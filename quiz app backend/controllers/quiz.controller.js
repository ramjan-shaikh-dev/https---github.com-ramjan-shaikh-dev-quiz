const db = require("../config/db");

const submitQuiz = async (req, res) => {
  try {

    const { answers } = req.body;

    let score = 0;

    for (const answer of answers) {

      const [result] = await db.execute(
        `
        SELECT *
        FROM quiz_question_answers
        WHERE quiz_questions_id = ?
        AND quiz_question_options_id = ?
        `,
        [
          answer.questionId,
          answer.optionId
        ]
      );

      if (result.length > 0) {
        score++;
      }
    }

    res.json({
      success: true,
      score,
      totalQuestions: answers.length
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Error submitting quiz"
    });
  }
};

module.exports = {
  submitQuiz
};