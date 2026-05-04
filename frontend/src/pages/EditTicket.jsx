import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AdminLayout from "../layouts/AdminLayout";

const EditTicket = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // ================= LOAD =================
  const fetchTicket = async () => {
    try {
      setFetching(true);

      const res = await axios.get("http://localhost:5000/api/tickets");
      const ticket = res.data.find((t) => t._id === id);

      if (ticket) {
        setForm({
          ...ticket,
          maintenanceDone: ticket.maintenanceDone || false
        });
      }
    } catch (err) {
      alert("Failed to load ticket");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [id]);

  // ================= CHANGE =================
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // ================= SAVE =================
  const submit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await axios.put(
        `http://localhost:5000/api/tickets/${id}`,
        {
          ...form,
          returnedAt:
            form.status === "Closed" ? new Date() : form.returnedAt || null
        }
      );

      navigate("/tickets");
    } catch (err) {
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (fetching || !form) {
    return (
      <AdminLayout>
        <p>Loading...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div style={styles.page}>

        {/* HEADER */}
        <div style={styles.header}>
          <h2>Edit Ticket</h2>
          <p>Update ticket information and maintenance status</p>
        </div>

        <form onSubmit={submit} style={styles.grid}>

          {/* ================= BASIC INFO ================= */}
          <div style={styles.card}>
            <h3>Basic Information</h3>

            <input name="serialNumber" placeholder="Serial Number" value={form.serialNumber || ""} onChange={handleChange} />
            <input name="tagNumber" placeholder="Tag Number" value={form.tagNumber || ""} onChange={handleChange} />
            <input name="pcModel" placeholder="PC Model" value={form.pcModel || ""} onChange={handleChange} />
            <input name="branch" placeholder="Branch" value={form.branch || ""} onChange={handleChange} />
            <input name="problem" placeholder="Problem" value={form.problem || ""} onChange={handleChange} />
            <input name="phone" placeholder="Phone" value={form.phone || ""} onChange={handleChange} />
          </div>

          {/* ================= RETURN ================= */}
          <div style={styles.card}>
            <h3>Return Details</h3>

            <select name="status" value={form.status || ""} onChange={handleChange}>
              <option value="Pending">Pending</option>
              <option value="Active">Active</option>
              <option value="Closed">Closed</option>
            </select>

            <input
              name="returnedBy"
              placeholder="Returned By"
              value={form.returnedBy || ""}
              onChange={handleChange}
            />

            <input
              name="returnedPerson"
              placeholder="Name"
              value={form.returnedPerson || ""}
              onChange={handleChange}
            />
          </div>

          {/* ================= MAINTENANCE ================= */}
          <div style={styles.card}>
            <h3>Maintenance</h3>

            <label style={styles.switch}>
              <input
                type="checkbox"
                checked={form.maintenanceDone}
                onChange={(e) =>
                  setForm({
                    ...form,
                    maintenanceDone: e.target.checked
                  })
                }
              />
              <span>
                {form.maintenanceDone
                  ? "Maintenance Done"
                  : "Not Maintained"}
              </span>
            </label>

            {form.maintenanceDone ? (
              <>
                <input
                  name="maintenanceType"
                  placeholder="What was fixed?"
                  value={form.maintenanceType || ""}
                  onChange={handleChange}
                />

                <textarea
                  name="maintenanceNotes"
                  placeholder="Maintenance Notes"
                  value={form.maintenanceNotes || ""}
                  onChange={handleChange}
                />
              </>
            ) : (
              <textarea
                name="maintenanceReasonNotDone"
                placeholder="Why was it not maintained?"
                value={form.maintenanceReasonNotDone || ""}
                onChange={handleChange}
              />
            )}
          </div>

          {/* ================= ACTION ================= */}
          <div style={styles.full}>
            <button type="submit" disabled={loading} style={styles.button}>
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>

        </form>
      </div>
    </AdminLayout>
  );
};

export default EditTicket;

/* ================= STYLES ================= */
const styles = {
  page: {
    padding: "20px"
  },

  header: {
    marginBottom: "20px"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "15px"
  },

  card: {
    background: "white",
    padding: "15px",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },

  full: {
    gridColumn: "1 / -1"
  },

  button: {
    background: "#95298e",
    color: "white",
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    width: "100%"
  },

  switch: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "#f3f3f3",
    padding: "10px",
    borderRadius: "8px"
  }
};