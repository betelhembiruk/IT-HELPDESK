import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    
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

   
    status: {
      type: String,
      enum: ["Pending", "Active", "Closed"],
      default: "Pending"
    },

    
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium"
    },

    slaDays: {
      type: Number,
      default: 3
    },

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


  { timestamps: true }
);

export default mongoose.model("Ticket", ticketSchema);