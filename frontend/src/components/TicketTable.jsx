import { useEffect, useState } from "react";
import api from "../api/axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const TicketTable = () => {
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // 📥 Fetch tickets
  const fetchTickets = async () => {
    const res = await api.get("/tickets");
    setTickets(res.data);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // 🔄 Update status
  const updateStatus = async (id, status) => {
    await api.put(`/tickets/${id}`, { status });
    fetchTickets();
  };

  // 🔍 Filter + Search
  const filteredTickets = tickets.filter((t) => {
    const matchesSearch =
      t.serialNumber?.toLowerCase().includes(search.toLowerCase()) ||
      t.tagNumber?.toLowerCase().includes(search.toLowerCase()) ||
      t.branchName?.toLowerCase().includes(search.toLowerCase()) ||
      t.problem?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || t.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // 🎨 Status colors
  const getStatusColor = (status) => {
    if (status === "Pending") return "orange";
    if (status === "Active") return "blue";
    if (status === "Closed") return "green";
    return "gray";
  };

  // 🖨️ PDF Export (Closed tickets only)
  const exportClosedPDF = () => {
    const doc = new jsPDF();

    const closedTickets = tickets.filter(t => t.status === "Closed");

    doc.setFontSize(18);
    doc.text("PC Maintenance Handover Report", 14, 15);

    doc.setFontSize(11);
    doc.text("IT Department - Maintenance System", 14, 22);

    doc.line(14, 25, 200, 25);

    const tableData = closedTickets.map(t => [
      t.serialNumber,
      t.tagNumber,
      t.branchName,
      t.problem,
      t.phone,
      t.createdAt?.split("T")[0]
    ]);

    autoTable(doc, {
      head: [["Serial", "Tag", "Branch", "Problem", "Phone", "Date"]],
      body: tableData,
      startY: 35
    });

    const finalY = doc.lastAutoTable.finalY + 20;

    doc.text("Delivered By (IT): ____________________", 14, finalY);
    doc.text("Received By (Client): ________________", 14, finalY + 10);

    doc.setFontSize(10);
    doc.text(
      `Generated on: ${new Date().toLocaleString()}`,
      14,
      finalY + 25
    );

    doc.save("closed-tickets-handover.pdf");
  };

  return (
    <div style={{ padding: "20px", width: "100%" }}>
      <h2>All Tickets</h2>

      {/* 🔍 SEARCH + FILTER */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
        <input
          placeholder="Search by serial, tag, branch..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: "8px", flex: 1 }}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: "8px" }}
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Active">Active</option>
          <option value="Closed">Closed</option>
        </select>

        <button
          onClick={exportClosedPDF}
          style={{
            padding: "8px 12px",
            background: "green",
            color: "white",
            border: "none",
            cursor: "pointer"
          }}
        >
          Export PDF
        </button>
      </div>

      {/* TABLE */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f2f2f2" }}>
            <th>Serial</th>
            <th>Tag</th>
            <th>Branch</th>
            <th>Problem</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredTickets.map((t) => (
            <tr key={t._id} style={{ borderBottom: "1px solid #ddd" }}>
              <td>{t.serialNumber}</td>
              <td>{t.tagNumber}</td>
              <td>{t.branchName}</td>
              <td>{t.problem}</td>

              {/* STATUS */}
              <td>
                <span
                  style={{
                    padding: "4px 8px",
                    borderRadius: "5px",
                    color: "white",
                    background: getStatusColor(t.status)
                  }}
                >
                  {t.status}
                </span>
              </td>

              {/* ACTIONS */}
              <td style={{ display: "flex", gap: "5px" }}>
                <button onClick={() => updateStatus(t._id, "Active")}>
                  Active
                </button>

                <button onClick={() => updateStatus(t._id, "Closed")}>
                  Close
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