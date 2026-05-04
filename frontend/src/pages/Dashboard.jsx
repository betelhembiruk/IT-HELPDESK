import { useEffect, useState } from "react";
import api from "../api/axios";
import AdminLayout from "../layouts/AdminLayout";

const Dashboard = () => {
  const [stats, setStats] = useState({
    pending: 0,
    active: 0,
    closed: 0
  });

  useEffect(() => {
    api.get("/tickets/stats/summary")
      .then(res => setStats(res.data));
  }, []);

  return (
    <AdminLayout>
      <h1 style={{ marginBottom: "20px" }}>Dashboard Overview</h1>

      {/* STATS GRID */}
      <div style={gridStyle}>
        <div style={{ ...card, background: "#ff9800" }}>
          <h2>{stats.pending}</h2>
          <p>Pending Tickets</p>
        </div>

        <div style={{ ...card, background: "#2196f3" }}>
          <h2>{stats.active}</h2>
          <p>Active Tickets</p>
        </div>

        <div style={{ ...card, background: "#4caf50" }}>
          <h2>{stats.closed}</h2>
          <p>Closed Tickets</p>
        </div>
      </div>

      {/* QUICK INFO SECTION */}
      <div style={tableBox}>
        <h3>System Status</h3>
        <p>✔ Backend Connected</p>
        <p>✔ MongoDB Connected</p>
        <p>✔ Ticket System Active</p>
      </div>
    </AdminLayout>
  );
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "20px"
};

const card = {
  color: "white",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
};

const tableBox = {
  marginTop: "30px",
  padding: "20px",
  background: "white",
  borderRadius: "10px"
};

export default Dashboard;