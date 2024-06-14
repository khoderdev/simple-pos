const express = require("express");
const router = express.Router();
const { Order, ReservedTables } = require("./salesModel");
const Product = require("./productModel");

// Close an order
router.post("/orders/close/:tableId", async (req, res) => {
  const tableId = `Table ${req.params.tableId}`;
  console.log(`Closing order for table ID: ${tableId}`);

  try {
    const order = await Order.findOneAndUpdate(
      { "table.tableId": tableId, "table.status": "open" },
      { $set: { "table.status": "closed" } },
      { new: true }
    );

    if (!order) {
      return res
        .status(404)
        .json({ message: "Order not found or already closed" });
    }

    res.json({ message: "Order closed successfully" });
  } catch (error) {
    console.error("Error closing order:", error.message);
    res.status(500).json({ message: error.message });
  }
});

// Create a new order
router.post("/orders/new", async (req, res) => {
  const { items, totalAmount, tableId } = req.body;

  try {
    if (!items || items.length === 0) {
      throw new Error("Items array is empty or not provided");
    }

    for (const item of items) {
      if (!item.totalAmount || !item.product) {
        throw new Error(
          "Each item in the order must have totalAmount and product"
        );
      }
    }

    await deductProductQuantities(items);

    const newOrder = new Order({ items, totalAmount, table: { tableId } });
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Error creating new order:", error.message);
    res.status(400).json({ message: error.message });
  }
});

// Deduct product quantities function
const deductProductQuantities = async (items) => {
  try {
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found`);
      }
      product.quantity -= item.quantity;
      await product.save();
    }
  } catch (error) {
    throw new Error(`Error deducting product quantities: ${error.message}`);
  }
};

// Get orders by table ID
router.get("/orders/table/:tableId", async (req, res) => {
  const tableId = `Table ${req.params.tableId}`;
  console.log(`Fetching orders for table ID: ${tableId}`);

  try {
    const orders = await Order.find({
      "table.tableId": tableId,
      "table.status": "open",
    });
    console.log(`Orders found: ${orders.length}`);
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error.message);
    res.status(500).json({ message: error.message });
  }
});

// GET all orders or orders by date range
router.get("/orders", async (req, res) => {
  const { fromDate, toDate } = req.query;

  const filter = {};
  if (fromDate) {
    filter.createdAt = { $gte: new Date(fromDate) };
  }
  if (toDate) {
    if (!filter.createdAt) {
      filter.createdAt = {};
    }
    filter.createdAt.$lte = new Date(new Date(toDate).getTime() + 86400000); // Include the end of the day
  }

  try {
    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete an order
router.delete("/orders/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      await order.remove();
      res.json({ message: "Order deleted" });
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update an order
router.put("/orders/:id", async (req, res) => {
  try {
    const orderId = req.params.id;
    const { items, totalAmount, tableId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (items) {
      order.items = items;
    }
    if (totalAmount) {
      order.totalAmount = totalAmount;
    }
    if (tableId) {
      order.table.tableId = tableId;
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Separate router for tables
const tablesRouter = express.Router();

// Get all reserved tables
tablesRouter.get("/reserved", async (req, res) => {
  try {
    const orders = await Order.find({ "table.status": "open" });
    const reservedTables = orders.map((order) => order.table.tableId);
    res.json({ reservedTables });
  } catch (error) {
    console.error("Error fetching reserved tables:", error.message);
    res.status(500).json({ message: error.message });
  }
});

// Get all available tables
tablesRouter.get("/available", async (req, res) => {
  try {
    const allTables = [
      "Table 1",
      "Table 2",
      "Table 3",
      "Table 4",
      "Table 5",
      "Table 6",
      "Table 7",
      "Table 8",
      "Table 9",
    ];

    const orders = await Order.find({ "table.status": "open" });
    const reservedTables = orders.map((order) => order.table.tableId);

    const availableTables = allTables.filter(
      (table) => !reservedTables.includes(table)
    );

    res.json({ availableTables });
  } catch (error) {
    console.error("Error fetching available tables:", error.message);
    res.status(500).json({ message: error.message });
  }
});

// Update reserved tables
router.put("/tables/reserved", async (req, res) => {
  const { tableId, isReserved } = req.body;
  try {
    await Table.findOneAndUpdate({ tableId }, { isReserved });
    res.status(200).send("Table reservation status updated");
  } catch (error) {
    res.status(500).send("Failed to update table reservation status");
  }
});
// router.put("/tables/reserved", async (req, res) => {
//   try {
//     const { tableId } = req.body;
//     // Update the reserved tables in the database
//     await ReservedTables.findOneAndUpdate(
//       { tableId },
//       { $set: { isReserved: true } },
//       { upsert: true }
//     );
//     res.json({ message: "Reserved tables updated successfully" });
//   } catch (error) {
//     console.error("Error updating reserved tables:", error.message);
//     res.status(500).json({ message: error.message });
//   }
// });

// Mount the tables router under the /tables path
router.use("/tables", tablesRouter);

module.exports = router;

// const express = require("express");
// const router = express.Router();
// const mongoose = require("mongoose");
// const { Order, ReservedTables } = require("./salesModel");
// const Product = require("./productModel");

// // Close an order
// router.post("/orders/close/:tableId", async (req, res) => {
//   const tableId = `Table ${req.params.tableId}`;
//   console.log(`Closing order for table ID: ${tableId}`);

//   try {
//     const order = await Order.findOneAndUpdate(
//       { "table.tableId": tableId, "table.status": "open" },
//       { $set: { "table.status": "closed" } },
//       { new: true }
//     );

//     if (!order) {
//       return res
//         .status(404)
//         .json({ message: "Order not found or already closed" });
//     }

//     // Mark table as Available when order is closed
//     await ReservedTables.findOneAndUpdate(
//       { tableId },
//       { $set: { isReserved: "Available" } }
//     );

//     res.json({ message: "Order closed successfully" });
//   } catch (error) {
//     console.error("Error closing order:", error.message);
//     res.status(500).json({ message: error.message });
//   }
// });

// // Create a new order
// router.post("/orders/new", async (req, res) => {
//   const { items, totalAmount, tableId } = req.body;

//   try {
//     if (!items || items.length === 0) {
//       throw new Error("Items array is empty or not provided");
//     }

//     for (const item of items) {
//       if (!item.totalAmount || !item.product) {
//         throw new Error(
//           "Each item in the order must have totalAmount and product"
//         );
//       }
//     }

//     // Check if table is already reserved
//     const existingReservation = await ReservedTables.findOne({ tableId });
//     if (existingReservation && existingReservation.isReserved === "Booked") {
//       throw new Error(`Table ${tableId} is already reserved`);
//     }

//     // Deduct product quantities
//     await deductProductQuantities(items);

//     // Create new order
//     const newOrder = new Order({
//       items,
//       totalAmount,
//       table: { tableId, isReserved: "Booked" },
//     });
//     const savedOrder = await newOrder.save();

//     // Mark table as Booked
//     await ReservedTables.findOneAndUpdate(
//       { tableId },
//       { $set: { isReserved: "Booked" } },
//       { upsert: true }
//     );

//     res.status(201).json(savedOrder);
//   } catch (error) {
//     console.error("Error creating new order:", error.message);
//     res.status(400).json({ message: error.message });
//   }
// });

// // Deduct product quantities function
// const deductProductQuantities = async (items) => {
//   try {
//     for (const item of items) {
//       const product = await Product.findById(item.product);
//       if (!product) {
//         throw new Error(`Product with ID ${item.product} not found`);
//       }
//       product.quantity -= item.quantity;
//       await product.save();
//     }
//   } catch (error) {
//     throw new Error(`Error deducting product quantities: ${error.message}`);
//   }
// };

// // Get orders by table ID
// router.get("/orders/table/:tableId", async (req, res) => {
//   const tableId = `Table ${req.params.tableId}`;
//   console.log(`Fetching orders for table ID: ${tableId}`);

//   try {
//     const orders = await Order.find({
//       "table.tableId": tableId,
//       "table.status": "open",
//     });
//     console.log(`Orders found: ${orders.length}`);
//     res.json(orders);
//   } catch (error) {
//     console.error("Error fetching orders:", error.message);
//     res.status(500).json({ message: error.message });
//   }
// });

// // GET all orders or orders by date range
// router.get("/orders", async (req, res) => {
//   const { fromDate, toDate } = req.query;

//   const filter = {};
//   if (fromDate) {
//     filter.createdAt = { $gte: new Date(fromDate) };
//   }
//   if (toDate) {
//     if (!filter.createdAt) {
//       filter.createdAt = {};
//     }
//     filter.createdAt.$lte = new Date(new Date(toDate).getTime() + 86400000); // Include the end of the day
//   }

//   try {
//     const orders = await Order.find(filter).sort({ createdAt: -1 });
//     res.json(orders);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Delete an order
// router.delete("/orders/:id", async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id);
//     if (order) {
//       await order.remove();

//       // Mark table as Available when order is deleted
//       await ReservedTables.findOneAndUpdate(
//         { tableId: order.table.tableId },
//         { $set: { isReserved: "Available" } }
//       );

//       res.json({ message: "Order deleted" });
//     } else {
//       res.status(404).json({ message: "Order not found" });
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Update an order
// router.put("/orders/:id", async (req, res) => {
//   try {
//     const orderId = req.params.id;
//     const { items, totalAmount, tableId } = req.body;

//     const order = await Order.findById(orderId);
//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     if (items) {
//       order.items = items;
//     }
//     if (totalAmount) {
//       order.totalAmount = totalAmount;
//     }
//     if (tableId) {
//       // Check if table is already reserved
//       const existingReservation = await ReservedTables.findOne({ tableId });
//       if (existingReservation && existingReservation.isReserved === "Booked") {
//         throw new Error(`Table ${tableId} is already reserved`);
//       }

//       order.table.tableId = tableId;

//       // Mark previous table as Available and new table as Booked
//       await ReservedTables.findOneAndUpdate(
//         { tableId: order.table.tableId },
//         { $set: { isReserved: "Available" } }
//       );

//       await ReservedTables.findOneAndUpdate(
//         { tableId },
//         { $set: { isReserved: "Booked" } },
//         { upsert: true }
//       );
//     }

//     const updatedOrder = await order.save();
//     res.json(updatedOrder);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Separate router for tables
// const tablesRouter = express.Router();

// // Get all reserved tables
// tablesRouter.get("/reserved", async (req, res) => {
//   try {
//     const reservedTables = await ReservedTables.find({
//       isReserved: "Booked",
//     }).select("tableId");
//     res.json({ reservedTables });
//   } catch (error) {
//     console.error("Error fetching reserved tables:", error.message);
//     res.status(500).json({ message: error.message });
//   }
// });

// // Get all available tables
// tablesRouter.get("/available", async (req, res) => {
//   try {
//     const allTables = [
//       "Table 1",
//       "Table 2",
//       "Table 3",
//       "Table 4",
//       "Table 5",
//       "Table 6",
//       "Table 7",
//       "Table 8",
//       "Table 9",
//     ];

//     const reservedTables = await ReservedTables.find({
//       isReserved: "Booked",
//     }).select("tableId");
//     const bookedTables = reservedTables.map((table) => table.tableId);

//     const availableTables = allTables.filter(
//       (table) => !bookedTables.includes(table)
//     );

//     res.json({ availableTables });
//   } catch (error) {
//     console.error("Error fetching available tables:", error.message);
//     res.status(500).json({ message: error.message });
//   }
// });

// // Update reserved table status
// router.put("/tables/reserved/:tableId", async (req, res) => {
//   const { tableId } = req.params;
//   const { isReserved } = req.body;

//   try {
//     const updatedReservation = await ReservedTables.findOneAndUpdate(
//       { tableId },
//       { $set: { isReserved } },
//       { new: true }
//     );

//     if (!updatedReservation) {
//       return res.status(404).json({ message: "Reserved table not found" });
//     }

//     res.json({
//       message: "Reserved table updated successfully",
//       updatedReservation,
//     });
//   } catch (error) {
//     console.error("Error updating reserved table:", error.message);
//     res.status(500).json({ message: error.message });
//   }
// });

// // Mount the tables router under the /tables path
// router.use("/tables", tablesRouter);

// module.exports = router;
