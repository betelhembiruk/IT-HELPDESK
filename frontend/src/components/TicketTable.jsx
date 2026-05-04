import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import QRCode from "qrcode";
const TicketTable = () => {
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);

  const navigate = useNavigate();


  const getHardware = (t) => t.hardwareType || "PC";

 
  const fetchTickets = async () => {
    const res = await api.get("/tickets");
    setTickets(res.data);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  
  const updateStatus = async (id, status) => {
    await api.put(`/tickets/${id}`, {
      status,
      returnedAt: status === "Closed" ? new Date() : null
    });

    fetchTickets();
  };

  
const printTicket = (t) => {
  if (t.status !== "Closed") {
    alert("Only CLOSED tickets can be printed");
    return;
  }

  const doc = new jsPDF();

  const logo = new Image();
  logo.src = "/logo.png";

  logo.onload = () => {
   
    doc.setFillColor(149, 41, 142);
    doc.rect(0, 0, 210, 45, "F");

   
    doc.addImage(logo, "PNG", 10, 6, 35, 35);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text("IT MAINTENANCE REPORT", 55, 22);

    doc.setFontSize(10);
    doc.text(`Date: ${new Date().toLocaleString()}`, 55, 30);

    doc.setTextColor(0, 0, 0);

   
    autoTable(doc, {
      startY: 55,
      theme: "grid",
      head: [["Field", "Details"]],
      headStyles: { fillColor: [149, 41, 142] },
      body: [
        ["Serial Number", t.serialNumber],
        ["Tag Number", t.tagNumber],
        ["Model", t.pcModel],
        ["Hardware Type", t.hardwareType || "PC"],
        ["Branch", t.branch],
        ["Problem", t.problem],
        ["Status", t.status],
        ["Phone", t.phone || "-"],
        ["Brought By", t.broughtBy || "-"],
        ["Returned By", t.returnedBy || "-"],
        ["Returned Person", t.returnedPerson || "-"],
        ["Created At", t.createdAt ? new Date(t.createdAt).toLocaleString() : "-"]
      ]
    });

   
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      theme: "striped",
      head: [["Maintenance Details"]],
      headStyles: { fillColor: [59, 130, 246] },
      body: [
        [`Type: ${t.maintenanceType || "-"}`],
        [`Done: ${t.maintenanceDone ? "Yes" : "No"}`],
        [`Notes: ${t.maintenanceNotes || "-"}`],
        [`Reason Not Done: ${t.maintenanceReasonNotDone || "-"}`]
      ]
    });

  
    const finalY = doc.lastAutoTable.finalY + 20;

    doc.setFontSize(11);
    doc.text("Received By: ______________________", 14, finalY);
    doc.text("Signature: ______________________", 14, finalY + 15);
    doc.text("Stamp: ______________________", 14, finalY + 30);

  

    doc.save(`ticket-${t.serialNumber || t._id}.pdf`);
  };
};


  const exportExcel = () => {
    const data = tickets.map(t => ({
      Serial: t.serialNumber,
      Tag: t.tagNumber,
      Model: t.pcModel,
      Hardware: getHardware(t),
      Branch: t.branch,
      Problem: t.problem,
      Status: t.status,
      ReturnedBy: t.returnedBy,
      Name: t.returnedPerson
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Tickets");

    const buffer = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array"
    });

    const file = new Blob([buffer], {
      type: "application/octet-stream"
    });

    saveAs(file, "tickets.xlsx");
  };

 
  const exportPDF = () => {
    const doc = new jsPDF();

    doc.text("Tickets Report", 14, 10);

    autoTable(doc, {
      startY: 20,
      head: [["Serial", "Tag", "Model", "Hardware", "Branch", "Status"]],
      body: tickets.map(t => [
        t.serialNumber,
        t.tagNumber,
        t.pcModel,
        getHardware(t),
        t.branch,
        t.status
      ])
    });

    doc.save("tickets.pdf");
  };


  const filtered = tickets.filter((t) =>
    t.serialNumber?.toLowerCase().includes(search.toLowerCase()) ||
    t.tagNumber?.toLowerCase().includes(search.toLowerCase()) ||
    t.branch?.toLowerCase().includes(search.toLowerCase()) ||
    t.problem?.toLowerCase().includes(search.toLowerCase()) ||
    t.pcModel?.toLowerCase().includes(search.toLowerCase()) ||
    getHardware(t).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.page}>

      {/* HEADER */}
      <div style={styles.header}>
        <h2 style={{ color: "#95298e" }}>All Tickets</h2>

        <div style={{ display: "flex", gap: "10px" }}>
          <input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.search}
          />

          <button onClick={exportExcel} style={styles.exportBtn}>
            Excel
          </button>

          <button onClick={exportPDF} style={styles.exportBtn}>
            PDF
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div style={styles.card}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>S/N</th>
              <th>Tag NO</th>
              <th>Model</th>
              <th>Hardware Type</th>
              <th>Branch Name</th>
              <th>Problem</th>
              <th>Status</th>
              <th>Created AT</th>
              <th>Returned AT</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((t) => (
              <tr
                key={t._id}
                onClick={() => setSelectedTicket(t)}
                style={{ cursor: "pointer" }}
              >
                <td>{t.serialNumber}</td>
                <td>{t.tagNumber}</td>
                <td>{t.pcModel}</td>

                {/* FIXED HARDWARE */}
                <td>{getHardware(t)}</td>

                <td>{t.branch}</td>
                <td>{t.problem}</td>

                <td>
                  <span style={{
                    ...styles.status,
                    background:
                      t.status === "Closed"
                        ? "#10b981"
                        : t.status === "Active"
                        ? "#3b82f6"
                        : "#f59e0b"
                  }}>
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

                {/* ACTIONS */}
                <td>
                  <div style={styles.actions}>
                    <button onClick={(e) => { e.stopPropagation(); updateStatus(t._id, "Active"); }} style={styles.activeBtn}>
                      Active
                    </button>

                    <button onClick={(e) => { e.stopPropagation(); updateStatus(t._id, "Closed"); }} style={styles.closeBtn}>
                      Close
                    </button>

                    <button onClick={(e) => { e.stopPropagation(); navigate(`/edit-ticket/${t._id}`); }} style={styles.editBtn}>
                      Edit
                    </button>

                    <button
                      onClick={(e) => { e.stopPropagation(); printTicket(t); }}
                      disabled={t.status !== "Closed"}
                      style={styles.printBtn}
                    >
                      🖨️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

  
      {selectedTicket && (
        <div style={styles.modalOverlay} onClick={() => setSelectedTicket(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>

            <h2 style={{ color: "#95298e" }}>Ticket Details</h2>

            <p><b>S/N:</b> {selectedTicket.serialNumber}</p>
            <p><b>Tag NO:</b> {selectedTicket.tagNumber}</p>
            <p><b>Model:</b> {selectedTicket.pcModel}</p>
            <p><b>Hardware Type:</b> {getHardware(selectedTicket)}</p>
            <p><b>Branch Name:</b> {selectedTicket.branch}</p>
            <p><b>Problem:</b> {selectedTicket.problem}</p>
            <p><b>Status:</b> {selectedTicket.status}</p>

            <button onClick={() => setSelectedTicket(null)} style={styles.closeModalBtn}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketTable;


const styles = {
  page: { padding: "20px", background: "#f4f4f7", minHeight: "100vh" },

  header: { display: "flex", justifyContent: "space-between", marginBottom: "15px" },

  search: { padding: "8px", width: "200px", borderRadius: "6px" },

  exportBtn: {
    background: "#95298e",
    color: "white",
    border: "none",
    padding: "8px 10px",
    borderRadius: "6px"
  },

  card: { background: "white", padding: "15px", borderRadius: "10px" },

  table: { width: "100%", borderCollapse: "collapse" },

  status: {
    padding: "4px 8px",
    borderRadius: "20px",
    color: "white"
  },

  actions: { display: "flex", gap: "5px" },

  activeBtn: { background: "#3b82f6", color: "white", border: "none", padding: "5px" },
  closeBtn: { background: "#10b981", color: "white", border: "none", padding: "5px" },
  editBtn: { background: "#95298e", color: "white", border: "none", padding: "5px" },
  printBtn: { background: "#000", color: "white", border: "none", padding: "5px" },

  modalOverlay: {
    position: "fixed",
    top: 0, left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },

  modal: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    width: "400px"
  },

  closeModalBtn: {
    marginTop: "10px",
    width: "100%",
    background: "#95298e",
    color: "white",
    border: "none",
    padding: "8px"
  }
};