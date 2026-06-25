import { useState } from "react";
import { useNavigate } from "react-router-dom";

function OTPPage() {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const email = localStorage.getItem("email");

  const handleVerifyOtp = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/1.0/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp,
          }),
        }
      );

      const data = await response.json();
      setIsLoading(false);

      if (data.success) {
        localStorage.setItem("is_verified", "true");
        navigate("/home");
      } else {
        alert(data.message || "Invalid OTP");
      }
    } catch (error) {
      setIsLoading(false);
      alert("Something went wrong");
    }
  };

  const handleResendOtp = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/1.0/send-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        alert("OTP sent successfully");
      } else {
        alert(data.message || "Unable to resend OTP");
      }
    } catch (error) {
      alert("Something went wrong while resending OTP");
    }
  };

  return (
    <div className="page-shell">
      <div className="container">
        <div className="card">
          <div className="top-bar">
            <div>
              <h2 className="page-title">Enter OTP to continue</h2>
              <p className="page-subtitle">
                We have sent a secure verification code to your registered email.
              </p>
            </div>
          </div>

          <div className="form-grid">
            <div className="field">
              <label>OTP Code</label>
              <input
                type="text"
                placeholder="Enter OTP code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
              <button className="btn-primary" onClick={handleVerifyOtp} type="button" disabled={isLoading}>
                {isLoading ? "Verifying..." : "Verify OTP"}
              </button>
              <button className="btn-secondary" onClick={handleResendOtp} type="button">
                Resend OTP
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OTPPage;
