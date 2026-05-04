import Ticket from "../models/Ticket.js";

// CREATE TICKET
export const createTicket = async (req, res) => {
  try {
    const ticket = new Ticket(req.body);
    const saved = await ticket.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL TICKETS
export const getTickets = async (req, res) => {
  try {
    const { status, search } = req.query;

    let query = {};

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { serialNumber: { $regex: search, $options: "i" } },
        { tagNumber: { $regex: search, $options: "i" } }
      ];
    }

    const tickets = await Ticket.find(query).sort({ createdAt: -1 });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE STATUS
export const updateTicket = async (req, res) => {
  try {
    const { status } = req.body;

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    ticket.status = status;
    ticket.updatedAt = new Date();

    if (status === "Closed") {
      ticket.closedAt = new Date();
    }

    const updated = await ticket.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET DASHBOARD STATS
export const getStats = async (req, res) => {
  try {
    const pending = await Ticket.countDocuments({ status: "Pending" });
    const active = await Ticket.countDocuments({ status: "Active" });
    const closed = await Ticket.countDocuments({ status: "Closed" });

    res.json({ pending, active, closed });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};