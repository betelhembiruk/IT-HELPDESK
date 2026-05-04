import express from "express";
import {
  createTicket,
  getTickets,
  updateTicket,
  getTicketStats
} from "../controllers/ticketController.js";

const router = express.Router();

router.post("/", createTicket);
router.get("/", getTickets);
router.put("/:id", updateTicket);
router.get("/stats/summary", getTicketStats);

export default router;