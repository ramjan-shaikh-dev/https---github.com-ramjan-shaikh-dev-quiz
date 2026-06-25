import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Result() {
  const navigate = useNavigate();

  const score = Number(localStorage.getItem("score")) || 0;
  const totalQuestions = Number(localStorage.getItem("totalQuestions")) || 0;

  const percentage = totalQuestions
    ? Math.round((score / totalQuestions) * 100)
    : 0;

  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/1.0/reasults/leaderboard"
      );

      const data = await response.json();

      console.log("API Response:", data);

      if (response.ok && data.success) {
        setLeaderboard(data.results || []);
      } else {
        console.log("Leaderboard fetch failed", response.status, data);
        setLeaderboard([]);
      }
    } catch (error) {
      console.log("Leaderboard error:", error);
      setLeaderboard([]);
    } finally {
      setLoading(false);
    }
  };

  console.log("Leaderboard State:", leaderboard);

  return (
    <div className="page-shell">
      <div className="container">
        <div className="card">
          <div className="top-bar">
            <div>
              <h1 className="page-title">Quiz Result 🎉</h1>
              <p className="page-subtitle">
                Review your performance and compare with other players.
              </p>
            </div>
          </div>

          <div className="result-panel">
            <div className="result-summary">
              <div>
                <p className="page-subtitle">Final Score</p>
                <h2>
                  {score} / {totalQuestions}
                </h2>
              </div>

              <div className="result-card">
                <strong>{percentage}%</strong>
                <span>Accuracy</span>
              </div>
            </div>

            <div className="result-details">
              {percentage >= 80 ? (
                <p>Excellent performance! 🔥</p>
              ) : (
                <p>
                  Keep practicing and improve your score next time.
                </p>
              )}
            </div>

            <hr />

            <h2>🏆 Leaderboard</h2>

            {loading ? (
              <p>Loading leaderboard...</p>
            ) : leaderboard.length === 0 ? (
              <p>No leaderboard data found.</p>
            ) : (
              leaderboard.slice(0, 3).map((player, index) => (
                <p key={player.id}>
                  {index === 0 && "🥇"}
                  {index === 1 && "🥈"}
                  {index === 2 && "🥉"}{" "}
                  #{index + 1} Rank : <strong>{player.name}</strong> (
                  {player.score})
                </p>
              ))
            )}

            <br />

            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
              }}
            >
              <button
                className="btn-primary"
                onClick={() => navigate("/quiz")}
              >
                Play Again
              </button>

              <button
                className="btn-secondary"
                onClick={() => navigate("/home")}
              >
                Back To Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Result;