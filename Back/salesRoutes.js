// const express = require("express");
// const router = express.Router();
// const Product = require("./productModel");
// const Order = require("./salesModel");

// // Create a new order
// router.post("/orders/new", async (req, res) => {
//   const { items, totalAmount, tableId } = req.body;

//   try {
//     // Validate each item in the order
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
// router.get("/orders/:tableId", async (req, res) => {
//   const tableId = req.params.tableId;

//   try {
//     const orders = await Order.find({ tableId });
//     res.json(orders);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // GET all orders
// router.get("/orders", async (req, res) => {
//   try {
//     const orders = await Order.find().sort({ createdAt: -1 });
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
//     ``;
//     res.status(500).json({ message: error.message });
//   }
// });

// // Update an order
// router.put("/orders/:id", async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id);
//     if (order) {
//       order.items = req.body.items || order.items;
//       order.totalAmount = req.body.totalAmount || order.totalAmount;
//       order.tableId = req.body.tableId || order.tableId;

//       const updatedOrder = await order.save();
//       res.json(updatedOrder);
//     } else {
//       res.status(404).json({ message: "Order not found" });
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// module.exports = router;

// const express = require("express");
// const router = express.Router();
// const Order = require("./salesModel");

// // Create a new order
// router.post("/orders/new", async (req, res) => {
//   const { items, totalAmount, tableId } = req.body;

//   try {
//     // Validate each item in the order
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
//   const tableId = req.params.tableId;

//   try {
//     const orders = await Order.find({ tableId });
//     res.json(orders);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // GET all orders
// router.get("/orders", async (req, res) => {
//   try {
//     const orders = await Order.find().sort({ createdAt: -1 });
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

//     // Check if the order exists
//     const order = await Order.findById(orderId);
//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     // Update the order fields if they are provided in the request body
//     if (items) {
//       order.items = items;
//     }
//     if (totalAmount) {
//       order.totalAmount = totalAmount;
//     }
//     if (tableId) {
//       order.tableId = tableId;
//     }

//     // Save the updated order
//     const updatedOrder = await order.save();
//     res.json(updatedOrder);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Add a new route to fetch table items
// router.get("/fetchTableItems", async (req, res) => {
//   try {
//     // Fetch table items from the Order collection
//     const orders = await Order.find();

//     // Extract availableTables and reservedTables from orders
//     const availableTables = orders
//       .filter((order) => order.tableId && order.items.length === 0)
//       .map((order) => order.tableId);
//     const reservedTables = orders
//       .filter((order) => order.tableId && order.items.length > 0)
//       .map((order) => order.tableId);

//     // Send the response with availableTables and reservedTables
//     res.json({ availableTables, reservedTables });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// module.exports = router;

// ____________________________________________________

const express = require("express");
const router = express.Router();
const Order = require("./salesModel");

// Create a new order
router.post("/orders/new", async (req, res) => {
  const { items, totalAmount, tableId } = req.body;

  try {
    // Validate each item in the order
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
    const orders = await Order.find({ tableId: tableId });
    console.log(`Orders found: ${orders.length}`);
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error.message);
    res.status(500).json({ message: error.message });
  }
});

// GET all orders
router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
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

    // Check if the order exists
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update the order fields if they are provided in the request body
    if (items) {
      order.items = items;
    }
    if (totalAmount) {
      order.totalAmount = totalAmount;
    }
    if (tableId) {
      order.tableId = tableId;
    }

    // Save the updated order
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a new route to fetch table items
router.get("/fetchTables", async (req, res) => {
  try {
    // Fetch table items from the Order collection
    const orders = await Order.find();

    // Extract availableTables and reservedTables from orders
    const availableTables = [];
    const reservedTables = [];

    orders.forEach((order) => {
      if (order.items.length === 0) {
        availableTables.push(order.tableId);
      } else {
        reservedTables.push(order.tableId);
      }
    });

    // Send the response with availableTables and reservedTables
    res.json({ availableTables, reservedTables });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
