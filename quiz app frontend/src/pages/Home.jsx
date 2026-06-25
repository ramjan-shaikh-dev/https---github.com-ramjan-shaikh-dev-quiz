import { useNavigate } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";

function Home() {
  const navigate = useNavigate();
  const email = localStorage.getItem("email") || "Learner";

  return (
    <div className="page-shell">
      <div className="container">
        <div className="card">
          <div className="top-bar">
            <div>
              <h1 className="page-title">Welcome back, {email}!</h1>
              <p className="page-subtitle">
                Continue your quiz journey and track your progress from the dashboard.
              </p>
            </div>
            <div className="user-badge">
              <span>Ready to learn</span>
            </div>
          </div>

          <div className="home-actions">
            <button className="btn-primary" onClick={() => navigate("/quiz")}>Start Quiz</button>
            <button className="btn-secondary" onClick={() => navigate("/result")}>View Last Result</button>
          </div>

          <div style={{ marginTop: "24px" }}>
            <LogoutButton />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

