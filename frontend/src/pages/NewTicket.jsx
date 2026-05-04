import { useState } from "react";
import axios from "axios";
import AdminLayout from "../layouts/AdminLayout";

const NewTicket = () => {
  const [form, setForm] = useState({
    serialNumber: "",
    tagNumber: "",
    pcModel: "", // ✅ NEW FIELD ADDED
    branch: "",
    problem: "",
    phone: "",
    broughtBy: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await axios.post("http://localhost:5000/api/tickets", form);

      alert("Ticket created successfully!");

      // reset form
      setForm({
        serialNumber: "",
        tagNumber: "",
        pcModel: "", // ✅ RESET ADDED
        branch: "",
        problem: "",
        phone: "",
        broughtBy: ""
      });

    } catch (err) {
      console.log(err);
      alert("Failed to create ticket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div style={{ maxWidth: "500px" }}>
        <h2>Create Ticket</h2>

        <form onSubmit={submit}>

          <input
            name="serialNumber"
            placeholder="Serial Number"
            value={form.serialNumber}
            onChange={handleChange}
          />

          <input
            name="tagNumber"
            placeholder="Tag Number"
            value={form.tagNumber}
            onChange={handleChange}
          />

          {/* ✅ NEW FIELD ADDED HERE */}
          <input
            name="pcModel"
            placeholder="PC Model / Type"
            value={form.pcModel}
            onChange={handleChange}
          />

          <input
            name="branch"
            placeholder="Branch"
            value={form.branch}
            onChange={handleChange}
          />

          <input
            name="problem"
            placeholder="Problem"
            value={form.problem}
            onChange={handleChange}
          />

          <input
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
          />

          <select
            name="broughtBy"
            value={form.broughtBy}
            onChange={handleChange}
          >
            <option value="">Select Brought By</option>
            <option value="IT Department">IT Department</option>
            <option value="File Operator">File Operator</option>
          </select>

          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Ticket"}
          </button>

        </form>
      </div>
    </AdminLayout>
  );
};

export default NewTicket;