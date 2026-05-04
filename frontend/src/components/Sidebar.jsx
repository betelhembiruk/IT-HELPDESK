import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();          // clear user + token
    navigate("/");     // redirect to login
  };

  const linkStyle = (path) => ({
    display: "block",
    padding: "10px",
    borderRadius: "6px",
    textDecoration: "none",
    color: "white",
    background: location.pathname === path ? "#333" : "transparent"
  });

  return (
    <div
      style={{
        width: "220px",
        minHeight: "100vh",
        background: "#111",
        color: "white",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
      }}
    >
      {/* TOP SECTION */}
      <div>
        <h2 style={{ marginBottom: "20px" }}>IT Panel</h2>

        <nav style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <Link to="/dashboard" style={linkStyle("/dashboard")}>
            Dashboard
          </Link>

          <Link to="/new-ticket" style={linkStyle("/new-ticket")}>
            New Ticket
          </Link>

          <Link to="/tickets" style={linkStyle("/tickets")}>
            All Tickets
          </Link>
        </nav>
      </div>

      {/* BOTTOM SECTION (LOGOUT) */}
      <div>
        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            padding: "10px",
            background: "red",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;