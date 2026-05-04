import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AdminLayout from "../layouts/AdminLayout";

const EditTicket = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    serialNumber: "",
    tagNumber: "",
    pcModel: "",
    branch: "",
    problem: "",
    phone: "",
    broughtBy: "",
    status: "",
    returnedBy: "",
    returnedPerson: "",

    // 🆕 MAINTENANCE
    maintenanceDone: false,
    maintenanceType: "",
    maintenanceNotes: "",
    maintenanceReasonNotDone: ""
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // =========================
  // LOAD SINGLE TICKET
  // =========================
  const fetchTicket = async () => {
    try {
      setFetching(true);

      const res = await axios.get(
        `http://localhost:5000/api/tickets`
      );

      const ticket = res.data.find((t) => t._id === id);

      if (ticket) {
        setForm({
          ...ticket,
          returnedBy: ticket.returnedBy || "",
          returnedPerson: ticket.returnedPerson || "",
          maintenanceDone: ticket.maintenanceDone || false,
          maintenanceType: ticket.maintenanceType || "",
          maintenanceNotes: ticket.maintenanceNotes || "",
          maintenanceReasonNotDone:
            ticket.maintenanceReasonNotDone || ""
        });
      }
    } catch (err) {
      console.log("Load error:", err.message);
      alert("Failed to load ticket");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [id]);

  // =========================
  // HANDLE CHANGE
  // =========================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // =========================
  // UPDATE
  // =========================
  const submit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        ...form,

        // auto returned date logic
        returnedAt:
          form.status === "Closed"
            ? new Date()
            : form.returnedAt || null
      };

      await axios.put(
        `http://localhost:5000/api/tickets/${id}`,
        payload
      );

      alert("Ticket updated successfully!");
      navigate("/tickets");
    } catch (err) {
      console.log("Update error:", err.message);
      alert("Failed to update ticket");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <AdminLayout>
        <p>Loading ticket...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div style={{ maxWidth: "600px" }}>
        <h2>Edit Ticket</h2>

        <form onSubmit={submit}>

          {/* ================= BASIC INFO ================= */}
          <input
            name="serialNumber"
            placeholder="Serial Number"
            value={form.serialNumber || ""}
            onChange={handleChange}
          />

          <input
            name="tagNumber"
            placeholder="Tag Number"
            value={form.tagNumber || ""}
            onChange={handleChange}
          />

          <input
            name="pcModel"
            placeholder="PC Model / Type"
            value={form.pcModel || ""}
            onChange={handleChange}
          />

          <input
            name="branch"
            placeholder="Branch"
            value={form.branch || ""}
            onChange={handleChange}
          />

          <input
            name="problem"
            placeholder="Problem"
            value={form.problem || ""}
            onChange={handleChange}
          />

          <input
            name="phone"
            placeholder="Phone"
            value={form.phone || ""}
            onChange={handleChange}
          />

          <select
            name="broughtBy"
            value={form.broughtBy || ""}
            onChange={handleChange}
          >
            <option value="">Brought By</option>
            <option value="IT Department">IT Department</option>
            <option value="File Operator">File Operator</option>
          </select>

          {/* ================= STATUS ================= */}
          <select
            name="status"
            value={form.status || ""}
            onChange={handleChange}
          >
            <option value="Pending">Pending</option>
            <option value="Active">Active</option>
            <option value="Closed">Closed</option>
          </select>

          <hr />

          {/* ================= RETURN ================= */}
          <h3>Return Details</h3>

          <select
            name="returnedBy"
            value={form.returnedBy || ""}
            onChange={handleChange}
          >
            <option value="">Returned By</option>
            <option value="IT Department">IT Department</option>
            <option value="File Operator">File Operator</option>
          </select>

          <input
            name="returnedPerson"
            placeholder="Returned Person Name"
            value={form.returnedPerson || ""}
            onChange={handleChange}
          />

          <hr />

          {/* ================= MAINTENANCE ================= */}
          <h3>Maintenance</h3>

          <select
            name="maintenanceDone"
            value={form.maintenanceDone}
            onChange={(e) =>
              setForm({
                ...form,
                maintenanceDone: e.target.value === "true"
              })
            }
          >
            <option value="true">Maintenance Done</option>
            <option value="false">Not Maintained</option>
          </select>

          {form.maintenanceDone ? (
            <>
              <input
                name="maintenanceType"
                placeholder="What was fixed?"
                value={form.maintenanceType}
                onChange={handleChange}
              />

              <textarea
                name="maintenanceNotes"
                placeholder="Maintenance Notes"
                value={form.maintenanceNotes}
                onChange={handleChange}
              />
            </>
          ) : (
            <textarea
              name="maintenanceReasonNotDone"
              placeholder="Why not maintained?"
              value={form.maintenanceReasonNotDone}
              onChange={handleChange}
            />
          )}

          {/* ================= SUBMIT ================= */}
          <button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Ticket"}
          </button>

        </form>
      </div>
    </AdminLayout>
  );
};

export default EditTicket;