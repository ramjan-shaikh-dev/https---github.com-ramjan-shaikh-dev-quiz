import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const response = await fetch("http://localhost:5000/api/1.0/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    const data = await response.json();
    setIsLoading(false);

    if (!response.ok) {
      alert(data.message);
      return;
    }

    navigate("/login");
  };

  return (
    <div className="page-shell">
      <div className="container">
        <div className="card">
          <div className="top-bar">
            <div>
              <h2 className="page-title">Create your premium account</h2>
              <p className="page-subtitle">
                Join a modern quiz experience built for learners who want fast progress and better outcomes.
              </p>
            </div>
          </div>

          <form onSubmit={handleSignup} className="form-grid">
            <div className="field">
              <label>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                required
              />
            </div>

            <div className="field">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="field">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Choose a strong password"
                required
              />
            </div>

            <button className="btn-primary" type="submit" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Signup"}
            </button>
          </form>

          <p className="page-subtitle" style={{ marginTop: "20px" }}>
            Already registered? <Link className="btn-secondary" to="/login">Login instead</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
