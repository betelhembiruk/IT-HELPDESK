import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaHome,
  FaTicketAlt,
  FaPlus,
  FaSignOutAlt
} from "react-icons/fa";

const AdminLayout = ({ children }) => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("auth");
    navigate("/");
  };

  return (
    <div style={styles.container}>

      {/* SIDEBAR */}
      <div style={{
        ...styles.sidebar,
        width: open ? "220px" : "70px"
      }}>

        {/* TOP */}
        <div style={styles.top}>
          <h3 style={{ color: "white", display: open ? "block" : "none" }}>
            IT Admin
          </h3>

          <FaBars
            onClick={() => setOpen(!open)}
            style={{ color: "white", cursor: "pointer" }}
          />
        </div>

        <Link style={styles.link} to="/dashboard">
          <FaHome /> {open && "Dashboard"}
        </Link>

        <Link style={styles.link} to="/tickets">
          <FaTicketAlt /> {open && "Tickets"}
        </Link>

        <Link style={styles.link} to="/new-ticket">
          <FaPlus /> {open && "New Ticket"}
        </Link>

        <button onClick={logout} style={styles.logout}>
          <FaSignOutAlt /> {open && "Logout"}
        </button>
      </div>

      {/* MAIN */}
      <div style={styles.main}>
        <div style={styles.topbar}>
          PC Maintenance System
        </div>

        <div style={styles.content}>
          {children}
        </div>
      </div>

    </div>
  );
};

const styles = {
  container: { display: "flex", height: "100vh" },

  sidebar: {
    background: "#111827",
    color: "white",
    padding: "15px",
    transition: "0.3s",
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },

  top: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  link: {
    color: "white",
    textDecoration: "none",
    display: "flex",
    gap: "10px",
    alignItems: "center",
    padding: "10px",
    borderRadius: "6px",
    background: "#1f2937"
  },

  logout: {
    marginTop: "auto",
    background: "red",
    color: "white",
    border: "none",
    padding: "10px",
    cursor: "pointer",
    display: "flex",
    gap: "10px",
    alignItems: "center"
  },

  main: { flex: 1, display: "flex", flexDirection: "column" },

  topbar: {
    height: "60px",
    background: "white",
    display: "flex",
    alignItems: "center",
    paddingLeft: "20px",
    fontWeight: "bold",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
  },

  content: {
    padding: "20px",
    background: "#f3f4f6",
    flex: 1
  }
};

export default AdminLayout;