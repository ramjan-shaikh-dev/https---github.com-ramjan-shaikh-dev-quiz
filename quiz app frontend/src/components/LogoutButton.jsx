import { useNavigate } from "react-router-dom";

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <button className="btn-secondary" onClick={handleLogout}>
      Logout
    </button>
  );
}

export default LogoutButton;
