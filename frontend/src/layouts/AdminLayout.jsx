import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
  const location = useLocation();

  const logout = () => {
    localStorage.removeItem("auth");
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div style={styles.container}>

      
      <div
        style={{
          ...styles.sidebar,
          width: open ? "220px" : "70px"
        }}
      >
    
        <div style={styles.top}>
          <div style={styles.sidebarHeader}>
           
            {open && <span style={styles.logoText}>Arada District IT</span>}
          </div>

          <FaBars
            onClick={() => setOpen(!open)}
            style={styles.menuIcon}
          />
        </div>

     
        <Link
          to="/dashboard"
          style={{
            ...styles.link,
            ...(isActive("/dashboard") && styles.activeLink)
          }}
        >
          <FaHome /> {open && "Dashboard"}
        </Link>

        <Link
          to="/tickets"
          style={{
            ...styles.link,
            ...(isActive("/tickets") && styles.activeLink)
          }}
        >
          <FaTicketAlt /> {open && "Tickets"}
        </Link>

        <Link
          to="/new-ticket"
          style={{
            ...styles.link,
            ...(isActive("/new-ticket") && styles.activeLink)
          }}
        >
          <FaPlus /> {open && "New Ticket"}
        </Link>

   
        <button onClick={logout} style={styles.logout}>
          <FaSignOutAlt /> {open && "Logout"}
        </button>
      </div>

     
      <div style={styles.main}>

        
        <div style={styles.topbar}>
          <div style={styles.topbarContent}>
            <img
              src="/logo.png"
              alt="logo"
              style={styles.topLogo}
            />
           
          </div>
        </div>

    
        <div style={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;


const styles = {
  container: {
    display: "flex",
    height: "100vh"
  },

  sidebar: {
    background: "linear-gradient(180deg, #95298e, #5f0a87)",
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

  sidebarHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },

  sidebarLogo: {
    width: "40px",
    height: "40px",
    objectFit: "contain",
    borderRadius: "8px"
  },

  logoText: {
    fontWeight: "bold",
    fontSize: "26px",
    whiteSpace: "nowrap"
  },

  menuIcon: {
    color: "white",
    cursor: "pointer",
    fontSize: "18px"
  },

  link: {
    color: "white",
    textDecoration: "none",
    display: "flex",
    gap: "10px",
    alignItems: "center",
    padding: "10px",
    borderRadius: "8px",
    background: "rgba(255,255,255,0.1)",
    transition: "0.2s"
  },

  activeLink: {
    background: "rgba(255,255,255,0.25)",
    fontWeight: "bold"
  },

  logout: {
    marginTop: "auto",
    background: "#ff4d4f",
    color: "white",
    border: "none",
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer",
    display: "flex",
    gap: "10px",
    alignItems: "center"
  },

  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column"
  },

  topbar: {
    height: "100px",
    background: "#95298e",
    color: "white",
    display: "flex",
    alignItems: "center",
    padding: "0 20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
  },

  topbarContent: {
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },

  topLogo: {
    height: "220px",
    width: "350px",
  },

 

  content: {
    padding: "20px",
    background: "#f5f5f7",
    flex: 1,
    overflow: "auto"
  }
};