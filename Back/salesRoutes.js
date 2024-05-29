// const express = require("express");
// const router = express.Router();
// const Order = require("./salesModel");

// // Close an order
// router.post("/orders/close/:tableId", async (req, res) => {
//   const tableId = `Table ${req.params.tableId}`;
//   console.log(`Closing order for table ID: ${tableId}`);

//   try {
//     const order = await Order.findOne({ tableId: tableId, status: "open" });
//     if (!order) {
//       return res
//         .status(404)
//         .json({ message: "Order not found or already closed" });
//     }

//     order.status = "closed";
//     await order.save();

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
//     items.forEach((item) => {
//       if (!item.totalAmount || !item.productId) {
//         throw new Error(
//           "Each item in the order must have totalAmount and productId"
//         );
//       }
//     });

//     const newOrder = new Order({
//       items,
//       totalAmount,
//       tableId,
//     });
//     const savedOrder = await newOrder.save();
//     res.status(201).json(savedOrder);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // Get orders by table ID
// router.get("/orders/table/:tableId", async (req, res) => {
//   const tableId = `Table ${req.params.tableId}`;
//   console.log(`Fetching orders for table ID: ${tableId}`);

//   try {
//     const orders = await Order.find({ tableId: tableId, status: "open" });
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
//       order.tableId = tableId;
//     }

//     const updatedOrder = await order.save();
//     res.json(updatedOrder);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Get all tables with their status
// router.get("/tables", async (req, res) => {
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

//     const orders = await Order.find({ status: "open" });
//     const reservedTables = orders.map((order) => order.tableId);

//     const availableTables = allTables.filter(
//       (table) => !reservedTables.includes(table)
//     );

//     res.json({ availableTables, reservedTables });
//   } catch (error) {
//     console.error("Error fetching tables:", error.message);
//     res.status(500).json({ message: error.message });
//   }
// });

// module.exports = router;

// _____________________________________________________

// const express = require("express");
// const router = express.Router();
// const Order = require("./salesModel");
// const Day = require("./daysModel");

// // Create a new day
// router.post("/days/new", async (req, res) => {
//   try {
//     const newDay = await Day.create({});
//     res.status(201).json(newDay);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // Close an order
// router.post("/orders/close/:tableId", async (req, res) => {
//   const tableId = `Table ${req.params.tableId}`;
//   console.log(`Closing order for table ID: ${tableId}`);

//   try {
//     const order = await Order.findOne({ tableId: tableId, status: "open" });
//     if (!order) {
//       return res
//         .status(404)
//         .json({ message: "Order not found or already closed" });
//     }

//     order.status = "closed";
//     await order.save();

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
//     items.forEach((item) => {
//       if (!item.totalAmount || !item.productId) {
//         throw new Error(
//           "Each item in the order must have totalAmount and productId"
//         );
//       }
//     });

//     const newOrder = new Order({
//       items,
//       totalAmount,
//       tableId,
//     });
//     const savedOrder = await newOrder.save();
//     res.status(201).json(savedOrder);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // Get orders by table ID
// router.get("/orders/table/:tableId", async (req, res) => {
//   const tableId = `Table ${req.params.tableId}`;
//   console.log(`Fetching orders for table ID: ${tableId}`);

//   try {
//     const orders = await Order.find({ tableId: tableId, status: "open" });
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
//       order.tableId = tableId;
//     }

//     const updatedOrder = await order.save();
//     res.json(updatedOrder);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Get all tables with their status
// router.get("/tables", async (req, res) => {
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

//     const orders = await Order.find({ status: "open" });
//     const reservedTables = orders.map((order) => order.tableId);

//     const availableTables = allTables.filter(
//       (table) => !reservedTables.includes(table)
//     );

//     res.json({ availableTables, reservedTables });
//   } catch (error) {
//     console.error("Error fetching tables:", error.message);
//     res.status(500).json({ message: error.message });
//   }
// });

// module.exports = router;

// __________________________________________________

const express = require("express");
const router = express.Router();
const Order = require("./salesModel");
const Day = require("./daysModel");

// Create a new day
router.post("/days/new", async (req, res) => {
  try {
    const newDay = await Day.create({});
    res.status(201).json(newDay);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all days
router.get("/days", async (req, res) => {
  try {
    const days = await Day.find({});
    res.json(days);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Close an order
router.post("/orders/close/:tableId", async (req, res) => {
  const tableId = `Table ${req.params.tableId}`;
  console.log(`Closing order for table ID: ${tableId}`);

  try {
    const order = await Order.findOne({ tableId: tableId, status: "open" });
    if (!order) {
      return res
        .status(404)
        .json({ message: "Order not found or already closed" });
    }

    order.status = "closed";
    await order.save();

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
    items.forEach((item) => {
      if (!item.totalAmount || !item.productId) {
        throw new Error(
          "Each item in the order must have totalAmount and productId"
        );
      }
    });

    const newOrder = new Order({
      items,
      totalAmount,
      tableId,
    });
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get orders by table ID
router.get("/orders/table/:tableId", async (req, res) => {
  const tableId = `Table ${req.params.tableId}`;
  console.log(`Fetching orders for table ID: ${tableId}`);

  try {
    const orders = await Order.find({ tableId: tableId, status: "open" });
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
      order.tableId = tableId;
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all tables with their status
router.get("/tables", async (req, res) => {
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

    const orders = await Order.find({ status: "open" });
    const reservedTables = orders.map((order) => order.tableId);

    const availableTables = allTables.filter(
      (table) => !reservedTables.includes(table)
    );

    res.json({ availableTables, reservedTables });
  } catch (error) {
    console.error("Error fetching tables:", error.message);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
