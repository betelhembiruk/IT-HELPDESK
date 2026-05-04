import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    // =========================
    // DEVICE INFO
    // =========================
    serialNumber: {
      type: String,
      required: true
    },

    tagNumber: String,
    pcModel: String,

    branch: {
      type: String,
      required: true
    },

    problem: {
      type: String,
      required: true
    },

    phone: String,
    broughtBy: String,

    // =========================
    // STATUS SYSTEM
    // =========================
    status: {
      type: String,
      enum: ["Pending", "Active", "Closed"],
      default: "Pending"
    },

    // =========================
    // PRIORITY SYSTEM (SLA)
    // =========================
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium"
    },

    slaDays: {
      type: Number,
      default: 3
    },

    // =========================
    // RETURN SYSTEM
    // =========================
    returnedBy: {
      type: String,
      default: ""
    },

    returnedPerson: {
      type: String,
      default: ""
    },

    returnedAt: {
      type: Date,
      default: null
    },

    // =========================
    // MAINTENANCE SYSTEM
    // =========================
    maintenanceDone: {
      type: Boolean,
      default: false
    },

    maintenanceType: {
      type: String,
      default: ""
    },

    maintenanceNotes: {
      type: String,
      default: ""
    },

    maintenanceReasonNotDone: {
      type: String,
      default: ""
    },hardwareType: {
  type: String,
  enum: ["PC", "Laptop", "Printer", "Scanner", "Other"],
  default: "PC"
}
  },

  // auto adds:
  // createdAt + updatedAt
  { timestamps: true }
);

export default mongoose.model("Ticket", ticketSchema);