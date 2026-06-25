import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/1.0/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      console.log("Login Response:", data);

      setIsLoading(false);

      if (!response.ok) {
        alert(data.message);
        return;
      }

      // Save user data
      localStorage.setItem(
        "email",
        data.user.email
      );

      localStorage.setItem(
        "userId",
        data.user.id
      );

      // Navigate according to verification status
      if (data.user.is_verified) {
        navigate("/home");
      } else {
        navigate("/otp");
      }

    } catch (error) {
      console.log(error);
      setIsLoading(false);
      alert("Something went wrong");
    }
  };

  return (
    <div className="page-shell">
      <div className="container">
        <div className="card">

          <div className="top-bar">
            <div>
              <h2 className="page-title">
                Access your learning suite
              </h2>

              <p className="page-subtitle">
                Sign in to continue your
                premium quiz journey.
              </p>
            </div>

            <div className="user-badge">
              <span>Premium learner</span>
            </div>
          </div>

          <form
            onSubmit={handleLogin}
            className="form-grid"
          >
            <div className="field">
              <label>Email</label>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="field">
              <label>Password</label>

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              className="btn-primary"
              type="submit"
              disabled={isLoading}
            >
              {isLoading
                ? "Signing in..."
                : "Login"}
            </button>
          </form>

          <p
            className="page-subtitle"
            style={{ marginTop: "18px" }}
          >
            New user?{" "}
            <Link
              className="btn-secondary"
              to="/signup"
            >
              Create Account
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Login;