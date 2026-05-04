import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const TicketTable = () => {
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  // =========================
  // FETCH TICKETS
  // =========================
  const fetchTickets = async () => {
    const res = await api.get("/tickets");
    setTickets(res.data);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // =========================
  // STATUS UPDATE
  // =========================
  const updateStatus = async (id, status) => {
    await api.put(`/tickets/${id}`, {
      status,
      returnedAt: status === "Closed" ? new Date() : null
    });

    fetchTickets();
  };

  // =========================
  // 🖨️ PROFESSIONAL PRINT (UPGRADED)
  // =========================
 import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const TicketTable = () => {
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  // =========================
  // FETCH TICKETS
  // =========================
  const fetchTickets = async () => {
    const res = await api.get("/tickets");
    setTickets(res.data);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // =========================
  // STATUS UPDATE
  // =========================
  const updateStatus = async (id, status) => {
    await api.put(`/tickets/${id}`, {
      status,
      returnedAt: status === "Closed" ? new Date() : null
    });

    fetchTickets();
  };

  // =========================
  // 🖨️ PROFESSIONAL PRINT (UPGRADED)
  // =========================
  const printTicket = (t) => {
    if (t.status !== "Closed") {
      alert("Only CLOSED tickets can be printed");
      return;
    }

    const doc = new jsPDF();

    // ================= HEADER =================
    doc.setFontSize(18);
    doc.text("PC MAINTENANCE HANDOVER REPORT", 14, 15);

    doc.setFontSize(10);
    doc.text(`Ticket ID: ${t._id}`, 14, 25);
    doc.text(
      `Generated: ${new Date().toLocaleString()}`,
      120,
      25
    );

    doc.line(14, 28, 200, 28);

    // ================= MAIN TABLE =================
    autoTable(doc, {
      startY: 35,
      theme: "grid",
      head: [["Field", "Details"]],
      body: [
        ["Serial Number", t.serialNumber || "-"],
        ["Tag Number", t.tagNumber || "-"],
        ["PC Model", t.pcModel || "-"],
        ["Branch", t.branch || "-"],
        ["Problem", t.problem || "-"],
        ["Phone", t.phone || "-"],
        ["Brought By", t.broughtBy || "-"],
        ["Priority", t.priority || "-"],
        ["Status", t.status || "-"],

        // RETURN INFO
        ["Returned By", t.returnedBy || "-"],
        ["Returned Person", t.returnedPerson || "-"],
        [
          "Returned At",
          t.returnedAt
            ? new Date(t.returnedAt).toLocaleString()
            : "-"
        ],

        // MAINTENANCE INFO
        ["Maintenance Done", t.maintenanceDone ? "Yes" : "No"],
        ["Maintenance Type", t.maintenanceType || "-"],
        ["Maintenance Notes", t.maintenanceNotes || "-"],
        ["Not Maintained Reason", t.maintenanceReasonNotDone || "-"],

        // TIMELINE
        [
          "Created At",
          t.createdAt
            ? new Date(t.createdAt).toLocaleString()
            : "-"
        ]
      ]
    });

    // ================= SIGNATURE SECTION =================
    const finalY = doc.lastAutoTable.finalY + 20;

    doc.text(
      "IT Department Signature: ____________________",
      14,
      finalY
    );

    doc.text(
      "Client Signature: ____________________________",
      14,
      finalY + 10
    );

    doc.save(`ticket-${t.serialNumber || t._id}.pdf`);
  };

  // =========================
  // SEARCH FILTER
  // =========================
  const filtered = tickets.filter((t) =>
    t.serialNumber?.toLowerCase().includes(search.toLowerCase()) ||
    t.tagNumber?.toLowerCase().includes(search.toLowerCase()) ||
    t.branch?.toLowerCase().includes(search.toLowerCase()) ||
    t.problem?.toLowerCase().includes(search.toLowerCase()) ||
    t.pcModel?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "20px" }}>
      <h2>All Tickets</h2>

      <input
        placeholder="Search tickets..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: "8px",
          width: "300px",
          marginBottom: "15px"
        }}
      />

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f3f3f3" }}>
            <th>Serial</th>
            <th>Tag</th>
            <th>PC Model</th>
            <th>Branch</th>
            <th>Problem</th>
            <th>Status</th>
            <th>Created</th>
            <th>Returned</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((t) => (
            <tr key={t._id} style={{ borderBottom: "1px solid #ddd" }}>
              <td>{t.serialNumber}</td>
              <td>{t.tagNumber}</td>
              <td>{t.pcModel || "-"}</td>
              <td>{t.branch}</td>
              <td>{t.problem}</td>

              <td>
                <span
                  style={{
                    padding: "4px 8px",
                    borderRadius: "5px",
                    color: "white",
                    background:
                      t.status === "Closed"
                        ? "green"
                        : t.status === "Active"
                        ? "blue"
                        : "orange"
                  }}
                >
                  {t.status}
                </span>
              </td>

              <td>
                {t.createdAt
                  ? new Date(t.createdAt).toLocaleDateString()
                  : "-"}
              </td>

              <td>
                {t.returnedAt
                  ? new Date(t.returnedAt).toLocaleDateString()
                  : "-"}
              </td>

              {/* ================= ACTIONS ================= */}
              <td style={{ display: "flex", gap: "8px" }}>
                <button onClick={() => updateStatus(t._id, "Active")}>
                  Active
                </button>

                <button onClick={() => updateStatus(t._id, "Closed")}>
                  Close
                </button>

                <button
                  onClick={() => navigate(`/edit-ticket/${t._id}`)}
                  style={{ background: "purple", color: "white" }}
                >
                  Edit
                </button>

                {/* PRINT */}
                <button
                  onClick={() => printTicket(t)}
                  disabled={t.status !== "Closed"}
                  style={{
                    background: t.status === "Closed" ? "#000" : "#999",
                    color: "white",
                    cursor:
                      t.status === "Closed"
                        ? "pointer"
                        : "not-allowed"
                  }}
                >
                  🖨️ Print
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TicketTable;

  // =========================
  // SEARCH FILTER
  // =========================
  const filtered = tickets.filter((t) =>
    t.serialNumber?.toLowerCase().includes(search.toLowerCase()) ||
    t.tagNumber?.toLowerCase().includes(search.toLowerCase()) ||
    t.branch?.toLowerCase().includes(search.toLowerCase()) ||
    t.problem?.toLowerCase().includes(search.toLowerCase()) ||
    t.pcModel?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "20px" }}>
      <h2>All Tickets</h2>

      <input
        placeholder="Search tickets..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: "8px",
          width: "300px",
          marginBottom: "15px"
        }}
      />

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f3f3f3" }}>
            <th>Serial</th>
            <th>Tag</th>
            <th>PC Model</th>
            <th>Branch</th>
            <th>Problem</th>
            <th>Status</th>
            <th>Created</th>
            <th>Returned</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((t) => (
            <tr key={t._id} style={{ borderBottom: "1px solid #ddd" }}>
              <td>{t.serialNumber}</td>
              <td>{t.tagNumber}</td>
              <td>{t.pcModel || "-"}</td>
              <td>{t.branch}</td>
              <td>{t.problem}</td>

              <td>
                <span
                  style={{
                    padding: "4px 8px",
                    borderRadius: "5px",
                    color: "white",
                    background:
                      t.status === "Closed"
                        ? "green"
                        : t.status === "Active"
                        ? "blue"
                        : "orange"
                  }}
                >
                  {t.status}
                </span>
              </td>

              <td>
                {t.createdAt
                  ? new Date(t.createdAt).toLocaleDateString()
                  : "-"}
              </td>

              <td>
                {t.returnedAt
                  ? new Date(t.returnedAt).toLocaleDateString()
                  : "-"}
              </td>

              {/* ================= ACTIONS ================= */}
              <td style={{ display: "flex", gap: "8px" }}>
                <button onClick={() => updateStatus(t._id, "Active")}>
                  Active
                </button>

                <button onClick={() => updateStatus(t._id, "Closed")}>
                  Close
                </button>

                <button
                  onClick={() => navigate(`/edit-ticket/${t._id}`)}
                  style={{ background: "purple", color: "white" }}
                >
                  Edit
                </button>

                {/* PRINT */}
                <button
                  onClick={() => printTicket(t)}
                  disabled={t.status !== "Closed"}
                  style={{
                    background: t.status === "Closed" ? "#000" : "#999",
                    color: "white",
                    cursor:
                      t.status === "Closed"
                        ? "pointer"
                        : "not-allowed"
                  }}
                >
                  🖨️ Print
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TicketTable;