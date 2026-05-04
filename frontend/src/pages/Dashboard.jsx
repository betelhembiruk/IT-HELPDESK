import { useEffect, useState } from "react";
import api from "../api/axios";
import AdminLayout from "../layouts/AdminLayout";

const Dashboard = () => {
  const [stats, setStats] = useState({ pending: 0, active: 0, closed: 0 });
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    api.get("/tickets/stats/summary")
      .then(res => setStats(res.data));

    api.get("/tickets")
      .then(res => setTickets(res.data));
  }, []);

  // ⏱️ NOT MAINTAINED IN 7 DAYS
  const overdue = tickets.filter(t => {
    const created = new Date(t.createdAt);
    const now = new Date();
    const diff = (now - created) / (1000 * 60 * 60 * 24);
    return diff > 7 && t.status !== "Closed";
  });

  return (
    <AdminLayout>

      <h2>Dashboard Overview</h2>

      {/* STATS */}
      <div style={styles.grid}>

        <div style={{ ...styles.card, background: "#f59e0b" }}>
          <h2>{stats.pending}</h2>
          <p>Pending</p>
        </div>

        <div style={{ ...styles.card, background: "#3b82f6" }}>
          <h2>{stats.active}</h2>
          <p>Active</p>
        </div>

        <div style={{ ...styles.card, background: "#10b981" }}>
          <h2>{stats.closed}</h2>
          <p>Closed</p>
        </div>

      </div>

      {/* ALERT BOX */}
      <div style={styles.alert}>
        <h3>⚠ Overdue Maintenance (7+ days)</h3>

        {overdue.length === 0 ? (
          <p>All systems up to date</p>
        ) : (
          overdue.map(t => (
            <div key={t._id} style={styles.item}>
              {t.pcModel} - {t.branch}
            </div>
          ))
        )}
      </div>

    </AdminLayout>
  );
};

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "15px"
  },

  card: {
    padding: "20px",
    color: "white",
    borderRadius: "10px"
  },

  alert: {
    marginTop: "20px",
    background: "white",
    padding: "20px",
    borderRadius: "10px"
  },

  item: {
    padding: "8px",
    borderBottom: "1px solid #ddd"
  }
};

export default Dashboard;