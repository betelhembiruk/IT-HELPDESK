import { useState } from "react";
import axios from "axios";

const NewTicket = () => {
  const [form, setForm] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();

    await axios.post("http://localhost:5000/api/tickets", form);
    alert("Ticket created!");
  };

  return (
    <form onSubmit={submit}>
      <input name="serialNumber" placeholder="Serial Number" onChange={handleChange} />
      <input name="tagNumber" placeholder="Tag Number" onChange={handleChange} />
      <input name="branchName" placeholder="Branch" onChange={handleChange} />
      <input name="problem" placeholder="Problem" onChange={handleChange} />
      <input name="phone" placeholder="Phone" onChange={handleChange} />

      <select name="broughtBy" onChange={handleChange}>
        <option>IT Department</option>
        <option>File Operator</option>
      </select>

      <button type="submit">Create Ticket</button>
    </form>
  );
};

export default NewTicket;