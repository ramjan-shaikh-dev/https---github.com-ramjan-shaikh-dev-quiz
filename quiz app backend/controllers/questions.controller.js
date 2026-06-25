const db = require("../config/db");

const getQuestions = async (req, res) => {
  try {

    const [rows] = await db.execute(`
      SELECT
        q.id AS question_id,
        q.question,
        o.id AS option_id,
        o.option_text
      FROM quiz_questions q
      LEFT JOIN quiz_question_options o
      ON q.id = o.quiz_questions_id
      ORDER BY q.id, o.id
    `);

    const questions = [];

    rows.forEach((row) => {

      let question = questions.find(
        (q) => q.id === row.question_id
      );

      if (!question) {
        question = {
          id: row.question_id,
          question: row.question,
          options: [],
        };

        questions.push(question);
      }

      question.options.push({
        id: row.option_id,
        option_text: row.option_text,
      });

    });

    res.json(questions);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error fetching questions",
    });
  }
};

module.exports = {
  getQuestions,
};