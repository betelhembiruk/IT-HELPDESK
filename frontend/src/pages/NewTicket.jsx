import { useState } from "react";
import axios from "axios";
import AdminLayout from "../layouts/AdminLayout";
import { toast } from "react-toastify";

const branches = [
  "41 Eyesus Branch",
  "Abiy Branch",
  "Addis Ababa Branch",
  "Afincho Ber Branch",
  "Amist Killo Branch",
  "Arada Ghiorgis Branch",
  "Arat Kilo Branch",
  "Bela Branch",
  "Bela Mazoria Branch",
  "Birhanina Selam Branch",
  "Churchill Godana Branch",
  "Dejach Wube Branch",
  "Diaspora Branch",
  "Etege Menen Branch",
  "Ferensay Legasion Branch",
  "Filwuha Branch",
  "Finfine Branch",
  "Gedam Sefer Branch",
  "Genet Tsigie Branch",
  "Gurara Kidane Mihret Branch",
  "Jan Meda Branch",
  "Kebena Branch",
  "Kidiste Mariam Branch",
  "Lagahar Branch",
  "Mahteme Ghandi Branch",
  "Mehal Ketema",
  "Menbere Patriarch Branch",
  "Meskel Square Branch",
  "Minilik Hospital Branch",
  "Piassa Branch",
  "Semen Mazegaja Branch",
  "Tayitu Bitul Branch",
  "Theodros Square Branch",
  "Tikur Anbessa Branch",
  "Tilahun Abay Branch",
  "Yared Branch"
];

const NewTicket = () => {
  const [form, setForm] = useState({
    serialNumber: "",
    tagNumber: "",
    pcModel: "",
    branch: "",
    problem: "",
    phone: "",
    broughtBy: "",
    hardwareType: "PC"   // ✅ NEW FIELD
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await axios.post("http://localhost:5000/api/tickets", form);

      toast.success("Ticket created successfully!");

      setForm({
        serialNumber: "",
        tagNumber: "",
        pcModel: "",
        branch: "",
        problem: "",
        phone: "",
        broughtBy: "",
        hardwareType: "PC"
      });

    } catch (err) {
      toast.error("Failed to create ticket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div style={styles.wrapper}>
        <div style={styles.card}>
          <h2 style={styles.title}>Create New Ticket</h2>

          <form onSubmit={submit} style={styles.form}>

            <input
              name="serialNumber"
              placeholder="Serial Number"
              value={form.serialNumber}
              onChange={handleChange}
              style={styles.input}
            />

            <input
              name="tagNumber"
              placeholder="Tag Number"
              value={form.tagNumber}
              onChange={handleChange}
              style={styles.input}
            />

            <input
              name="pcModel"
              placeholder=" Model"
              value={form.pcModel}
              onChange={handleChange}
              style={styles.input}
            />

            {/* ✅ HARDWARE TYPE */}
            <select
              name="hardwareType"
              value={form.hardwareType}
              onChange={handleChange}
              style={styles.input}
            >
              <option value="PC">PC</option>
              <option value="Laptop">Laptop</option>
              <option value="Printer">Printer</option>
              <option value="Scanner">Scanner</option>
              <option value="Other">Other</option>
            </select>

            {/* BRANCH */}
            <select
              name="branch"
              value={form.branch}
              onChange={handleChange}
              style={styles.input}
            >
              <option value="">Select Branch</option>
              {branches.map((b, i) => (
                <option key={i} value={b}>
                  {b}
                </option>
              ))}
            </select>

            <input
              name="problem"
              placeholder="Problem Description"
              value={form.problem}
              onChange={handleChange}
              style={styles.input}
            />

            <input
              name="phone"
              placeholder="Phone"
              value={form.phone}
              onChange={handleChange}
              style={styles.input}
            />

            <select
              name="broughtBy"
              value={form.broughtBy}
              onChange={handleChange}
              style={styles.input}
            >
              <option value="">Brought By</option>
              <option value="IT Department">IT Department</option>
              <option value="Branch Staff">Branch Staff</option>
            </select>

            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? "Creating..." : "Create Ticket"}
            </button>

          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

const styles = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "80vh",
    background: "#f3f4f6"
  },

  card: {
    width: "100%",
    maxWidth: "520px",
    background: "white",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
  },

  title: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#95298e"
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },

  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "14px"
  },

  button: {
    padding: "12px",
    background: "#95298e",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: "10px"
  }
};

export default NewTicket;