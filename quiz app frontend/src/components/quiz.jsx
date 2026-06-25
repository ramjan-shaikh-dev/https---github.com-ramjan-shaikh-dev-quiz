import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/1.0/questions"
      );

      const data = await response.json();

      setQuestions(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAnswer = (questionId, optionId) => {
    const filtered = answers.filter(
      (a) => a.questionId !== questionId
    );

    filtered.push({
      questionId,
      optionId,
    });

    setAnswers(filtered);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Step 1 - Calculate score
      const response = await fetch(
        "http://localhost:5000/api/1.0/quiz/submit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            answers,
          }),
        }
      );

      const data = await response.json();

      const score = data.score;
      const totalQuestions = data.totalQuestions;

      // Step 2 - Save in localStorage
      localStorage.setItem("score", score);
      localStorage.setItem(
        "totalQuestions",
        totalQuestions
      );

      // Step 3 - Save result in DB
      const userId = localStorage.getItem("userId");

      await fetch(
        "http://localhost:5000/api/1.0/reasults/save",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            score,
            totalQuestions,
          }),
        }
      );

      // Step 4 - Go to Result page
      navigate("/result");

    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const completed = answers.length;
  const total = questions.length;
  const progress = total
    ? Math.round((completed / total) * 100)
    : 0;

  return (
    <div className="page-shell">
      <div className="container">
        <div className="card">

          <div className="top-bar">
            <div>
              <h1 className="page-title">
                Quiz Practice
              </h1>

              <p className="page-subtitle">
                Answer all questions and
                submit your quiz.
              </p>
            </div>

            <div className="user-badge">
              <span>
                {completed}/{total} Answered
              </span>
            </div>
          </div>

          <div className="progress-shell">
            <div className="progress-label">
              <span>Completion</span>
              <strong>{progress}%</strong>
            </div>

            <div className="progress-bar">
              <div
                className="progress-filled"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>
          </div>

          {questions.map((q) => (
            <div
              key={q.id}
              className="quiz-card"
            >
              <h3>{q.question}</h3>

              {q.options?.map((option) => (
                <label
                  key={option.id}
                  className="option-card"
                >
                  <input
                    type="radio"
                    name={`question-${q.id}`}
                    onChange={() =>
                      handleAnswer(
                        q.id,
                        option.id
                      )
                    }
                  />

                  <span>
                    {option.option_text}
                  </span>
                </label>
              ))}
            </div>
          ))}

          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={
              isSubmitting || !total
            }
          >
            {isSubmitting
              ? "Submitting..."
              : "Submit Quiz"}
          </button>

        </div>
      </div>
    </div>
  );
}

export default Quiz;