import { useEffect, useState } from "react";
import api from "../api/axios";
import AdminLayout from "../layouts/AdminLayout";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const Dashboard = () => {
  const [stats, setStats] = useState({ pending: 0, active: 0, closed: 0 });
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    api.get("/tickets/stats/summary").then(res => setStats(res.data));
    api.get("/tickets").then(res => setTickets(res.data));
  }, []);

  const overdue = tickets.filter(t => {
    const created = new Date(t.createdAt);
    const diff = (new Date() - created) / (1000 * 60 * 60 * 24);
    return diff > 7 && t.status !== "Closed";
  });

  const chartData = [
    { name: "Pending", value: stats.pending },
    { name: "Active", value: stats.active },
    { name: "Closed", value: stats.closed }
  ];

  const COLORS = ["#f59e0b", "#3b82f6", "#10b981"];

  // ✅ HARDWARE DATA
  const hardwareData = Object.values(
    tickets.reduce((acc, t) => {
      const type = t.hardwareType || "PC";
      if (!acc[type]) acc[type] = { name: type, value: 0 };
      acc[type].value++;
      return acc;
    }, {})
  );

  const hardwareColors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  return (
    <AdminLayout>

      <h2 style={{ marginBottom: "20px", color: "#95298e" }}>
        Dashboard Overview
      </h2>

      {/* CARDS */}
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

      {/* CHARTS */}
      <div style={styles.row}>

        {/* STATUS */}
        <div style={styles.chartBox}>
          <h3>Ticket Status Overview</h3>

          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={chartData} dataKey="value" nameKey="name" outerRadius={90} label>
                {chartData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* HARDWARE */}
        <div style={styles.chartBox}>
          <h3>Hardware Type Overview</h3>

          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={hardwareData} dataKey="value" nameKey="name" outerRadius={90} label>
                {hardwareData.map((_, i) => (
                  <Cell key={i} fill={hardwareColors[i % hardwareColors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* OVERDUE */}
        <div style={styles.alert}>
          <h3>⚠ Overdue Maintenance (7+ days)</h3>

          {overdue.length === 0 ? (
            <p>All systems up to date</p>
          ) : (
            overdue.map(t => (
              <div key={t._id} style={styles.item}>
                <strong>{t.pcModel}</strong> — {t.branch}
              </div>
            ))
          )}
        </div>

      </div>

      {/* RECENT */}
      <div style={styles.tableBox}>
        <h3>Recent Tickets</h3>

        <table style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Serial</th>
              <th>Branch</th>
              <th>Status</th>
              <th>Hardware</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {tickets.slice(0, 5).map(t => (
              <tr key={t._id}>
                <td>{t.serialNumber}</td>
                <td>{t.branch}</td>
                <td>{t.status}</td>
                <td>{t.hardwareType || "PC"}</td>
                <td>{new Date(t.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </AdminLayout>
  );
};

export default Dashboard;

/* ================= STYLES (FIXED) ================= */
const styles = {
  row: {
    display: "flex",
    gap: "50px",
    alignItems: "flex-start",
    marginBottom: "30px"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "20px",
    marginBottom: "20px"
  },

  card: {
    padding: "20px",
    color: "white",
    borderRadius: "12px",
    textAlign: "center",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
  },

  chartBox: {
    flex: 1,
    background: "white",
    padding: "20px",
    borderRadius: "22px"
  },

  alert: {
    background: "white",
    padding: "20px",
    borderRadius: "12px"
  },

  item: {
    padding: "8px",
    borderBottom: "1px solid #eee"
  },

  tableBox: {
    background: "white",
    padding: "20px",
    borderRadius: "12px"
  }
};