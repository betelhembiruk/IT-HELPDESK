import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        username,
        password
      });

      if (res.data.success) {
        localStorage.setItem("auth", "true");
        navigate("/dashboard");
      }
    } catch (err) {
      toast.error("Login failed");
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleLogin} style={styles.card}>

        <div style={styles.header}>
          <img src="/logo.png" alt="logo" style={styles.logo} />

          <h2 style={styles.systemTitle}>
            Arada District IT <br></br>Maintenance Status System
          </h2>
        </div>


        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          Login
        </button>

      </form>
    </div>
  );
};

export default Login;


const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",

    background: "linear-gradient(135deg, #95298e, #5f0a87)"
  },

  card: {
    width: "500px",
    padding: "30px",
    borderRadius: "15px",
    background: "white",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },

  header: {
    marginBottom: "10px"
  },

  logo: {
    width: "400px",
    height: "200px",
    marginBottom: "10px"
  },

  systemTitle: {
    fontSize: "35px",
    fontWeight: "bold",
    color: "#333",
  },

  subtitle: {
    fontSize: "14px",
    color: "gray"
  },

  input: {
    padding: "20px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    outline: "none"
  },

  button: {
    padding: "20px",
    borderRadius: "8px",
    border: "none",
    background: "#95298e",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold"
  }
};