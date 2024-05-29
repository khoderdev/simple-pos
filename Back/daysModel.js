const mongoose = require("mongoose");
// const Day = require("./daysModel")


const daySchema = new mongoose.Schema({
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
});

const Day = mongoose.model("Day", daySchema);

module.exports = Day;
