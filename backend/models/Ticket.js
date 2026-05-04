import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  serialNumber: { type: String, required: true },
  tagNumber: { type: String, required: true },
  branchName: { type: String, required: true },

  problem: { type: String, required: true },
  description: String,

  phone: String,

  broughtBy: {
    type: String,
    enum: ["IT Department", "File Operator"],
    required: true
  },

  status: {
    type: String,
    enum: ["Pending", "Active", "Closed"],
    default: "Pending"
  },

  hardwareRequested: {
    type: Boolean,
    default: false
  },

  hardwareDetails: String,

  createdAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: Date,

  closedAt: Date
});

export default mongoose.model("Ticket", ticketSchema);