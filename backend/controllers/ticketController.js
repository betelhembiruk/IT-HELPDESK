import Ticket from "../models/Ticket.js";

/* =========================
   CREATE TICKET
========================= */
export const createTicket = async (req, res) => {
  try {
    console.log("📩 New Ticket:", req.body);

    const {
      serialNumber,
      tagNumber,
      pcModel,
      branch,
      problem,
      phone,
      broughtBy,
      priority,
      slaDays
    } = req.body;

    // validation
    if (!serialNumber || !branch || !problem) {
      return res.status(400).json({
        message: "Required fields missing"
      });
    }

    const ticket = await Ticket.create({
      serialNumber,
      tagNumber,
      pcModel,
      branch,
      problem,
      phone,
      broughtBy,

      // defaults handled by schema (better than forcing here)
      status: "Pending",
      priority: priority || "Medium",
      slaDays: slaDays || 3
    });

    res.status(201).json(ticket);
  } catch (err) {
    console.log("❌ Create Error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   GET ALL TICKETS
========================= */
export const getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find().sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   UPDATE TICKET
   (RETURN + MAINTENANCE + SLA READY)
========================= */
export const updateTicket = async (req, res) => {
  try {
    const updateData = { ...req.body };

    const existing = await Ticket.findById(req.params.id);

    if (!existing) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // =========================
    // RETURN LOGIC
    // =========================
    if (
      updateData.status === "Closed" &&
      existing.status !== "Closed"
    ) {
      updateData.returnedAt = new Date();
    }

    if (updateData.status !== "Closed") {
      updateData.returnedAt = null;
    }

    // =========================
    // MAINTENANCE CLEANUP LOGIC
    // =========================
    if (updateData.maintenanceDone === false || updateData.maintenanceDone === "false") {
      updateData.maintenanceType = "";
      updateData.maintenanceNotes = "";
    }

    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(ticket);
  } catch (err) {
    console.log("❌ Update Error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   DASHBOARD STATS
========================= */
export const getTicketStats = async (req, res) => {
  try {
    const pending = await Ticket.countDocuments({ status: "Pending" });
    const active = await Ticket.countDocuments({ status: "Active" });
    const closed = await Ticket.countDocuments({ status: "Closed" });

    res.json({
      pending,
      active,
      closed
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};