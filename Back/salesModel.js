// const mongoose = require("mongoose");

// const orderItemSchema = new mongoose.Schema({
//   product: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Product",
//     required: true,
//   },
//   quantity: {
//     type: Number,
//     required: true,
//   },
//   totalAmount: {
//     type: Number,
//     required: true,
//   },
// });

// const orderSchema = new mongoose.Schema({
//   items: [orderItemSchema],
//   totalAmount: {
//     type: Number,
//     required: true,
//   },
//   tableId: {
//     type: String,
//     required: true,
//   },
//   status: {
//     type: String,
//     enum: ["open", "closed"],
//     default: "open",
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// const Order = mongoose.model("Order", orderSchema);

// module.exports = Order;

// const mongoose = require("mongoose");

// // Define schema for reserved tables
// const reservedTablesSchema = new mongoose.Schema({
//   reservedTables: [String], // Assuming reserved tables are stored as an array of strings
// });

// // Define schema for order items
// const orderItemSchema = new mongoose.Schema({
//   product: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Product",
//     required: true,
//   },
//   quantity: {
//     type: Number,
//     required: true,
//   },
//   totalAmount: {
//     type: Number,
//     required: true,
//   },
// });

// // Define schema for orders
// const orderSchema = new mongoose.Schema({
//   items: [orderItemSchema],
//   totalAmount: {
//     type: Number,
//     required: true,
//   },
//   tableId: {
//     type: String,
//     required: true,
//   },
//   status: {
//     type: String,
//     enum: ["open", "closed"],
//     default: "open",
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// // Create models
// const Order = mongoose.model("Order", orderSchema);
// const ReservedTables = mongoose.model("ReservedTables", reservedTablesSchema);

// module.exports = {
//   Order,
//   ReservedTables,
// };

// const mongoose = require("mongoose");

// // Define schema for reserved tables
// const reservedTablesSchema = new mongoose.Schema({
//   tableId: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   isReserved: {
//     type: Boolean,
//     default: false,
//   },
// });

// // Define schema for order items
// const orderItemSchema = new mongoose.Schema({
//   product: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Product",
//     required: true,
//   },
//   quantity: {
//     type: Number,
//     required: true,
//   },
//   totalAmount: {
//     type: Number,
//     required: true,
//   },
// });

// // Define schema for orders
// const orderSchema = new mongoose.Schema({
//   items: [orderItemSchema],
//   totalAmount: {
//     type: Number,
//     required: true,
//   },
//   tableId: {
//     type: String,
//     required: true,
//   },
//   status: {
//     type: String,
//     enum: ["open", "closed"],
//     default: "open",
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// // Create models
// const Order = mongoose.model("Order", orderSchema);
// const ReservedTables = mongoose.model("ReservedTables", reservedTablesSchema);

// module.exports = {
//   Order,
//   ReservedTables,
// };

const mongoose = require("mongoose");

// Define schema for reserved tables
const reservedTablesSchema = new mongoose.Schema({
  tableId: {
    type: String,
    required: true,
    unique: true,
  },
  isReserved: {
    type: Boolean,
    default: false,
  },
});

// Define schema for order items
const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
});

// Define schema for orders
const orderSchema = new mongoose.Schema({
  items: [orderItemSchema],
  totalAmount: {
    type: Number,
    required: true,
  },
  table: {
    type: {
      tableId: {
        type: String,
        required: true,
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
    },
    required: true,
  },
});

// Create models
const Order = mongoose.model("Order", orderSchema);
const ReservedTables = mongoose.model("ReservedTables", reservedTablesSchema);

module.exports = {
  Order,
  ReservedTables,
};
