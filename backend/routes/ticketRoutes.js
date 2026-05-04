import express from "express";
import {
  getTickets,
  createTicket,
  updateTicket
} from "../controllers/ticketController.js";

const router = express.Router();

router.get("/", getTickets);
router.post("/", createTicket);

// ✅ THIS IS REQUIRED
router.put("/:id", updateTicket);

export default router;