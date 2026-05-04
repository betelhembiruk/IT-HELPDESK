import { Parser } from "json2csv";
import Ticket from "../models/Ticket.js";

export const exportClosedTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ status: "Closed" });

    const fields = [
      "serialNumber",
      "tagNumber",
      "branchName",
      "problem",
      "status",
      "createdAt",
      "closedAt"
    ];

    const parser = new Parser({ fields });
    const csv = parser.parse(tickets);

    res.header("Content-Type", "text/csv");
    res.attachment("closed-tickets.csv");
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};