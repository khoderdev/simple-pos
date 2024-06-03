// tableModel.js
const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema({
  tableId: {
    type: String,
    required: true,
    unique: true, // Ensure tableId is unique
  },
  isReserved: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ["open", "closed"],
    default: "open",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Table = mongoose.model("Table", tableSchema);

module.exports = Table;