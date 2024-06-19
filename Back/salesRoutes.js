const express = require("express");
const router = express.Router();
const { Order, ReservedTables } = require("./salesModel");
const Product = require("./productModel");
const tablesRouter = express.Router();

// Create a new order
router.post("/orders1/new", async (req, res) => {
  const { items, totalAmount } = req.body;

  try {
    if (!items || items.length === 0) {
      throw new Error("Items array is empty or not provided");
    }

    for (const item of items) {
      if (!item.totalAmount) {
        throw new Error(
          "(orders1)Each item in the order must have totalAmount, productId, and quantity"
        );
      }
    }

    if (!totalAmount) {
      throw new Error("Total amount is required");
    }

    await deductProductQuantitiesNoTables(items);

    const newOrder = new Order({ items, totalAmount });
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Error creating new order:", error.message);
    res.status(400).json({ message: error.message });
  }
});

// Deduct product quantities function
const deductProductQuantitiesNoTables = async (items) => {
  try {
    for (const item of items) {
      const product = await Product.findById(item.product._id);
      if (!product) {
        throw new Error(`Product with _id ${item.product._id} not found`);
      }
      product.quantity -= item.quantity;
      await product.save();
    }
  } catch (error) {
    throw new Error(`Error deducting product quantities: ${error.message}`);
  }
};

// Get all orders1 or orders by date range
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

// Delete an order1
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

// Update an order1
router.put("/orders/update/:id", async (req, res) => {
  try {
    const orderId = req.params.id;
    const { items, totalAmount } = req.body;

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

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Close an order1
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

// ///////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////

// Create a new order
router.post("/orders/new", async (req, res) => {
  const { items, totalAmount, tableId } = req.body;

  try {
    if (!items || items.length === 0) {
      throw new Error("Items array is empty or not provided");
    }

    for (const item of items) {
      if (!item.totalAmount || !item.quantity) {
        throw new Error(
          "Each item in the order must have totalAmount, productId, and quantity"
        );
      }
    }

    if (!totalAmount) {
      throw new Error("Total amount is required");
    }

    if (!tableId) {
      throw new Error("Table ID is required");
    }

    await deductProductQuantities(items);

    const newOrder = new Order({
      items,
      totalAmount,
      table: { tableId, status: "open" },
    });
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
      const productId = item.productId || item._id; // Adjust based on actual structure
      if (!productId) {
        throw new Error(
          `Product ID is missing for item: ${JSON.stringify(item)}`
        );
      }

      const product = await Product.findById(productId);
      if (!product) {
        throw new Error(`Product with ID ${productId} not found`);
      }

      if (product.quantity < item.quantity) {
        throw new Error(
          `Insufficient quantity for product with ID ${productId}`
        );
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
router.put("/orders/update/:id", async (req, res) => {
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
tablesRouter.put("/reserved", async (req, res) => {
  try {
    const { tableId } = req.body;
    // Update the reserved tables in the database
    await ReservedTables.findOneAndUpdate(
      { tableId },
      { $set: { isReserved: true } },
      { upsert: true }
    );
    res.json({ message: "Reserved tables updated successfully" });
  } catch (error) {
    console.error("Error updating reserved tables:", error.message);
    res.status(500).json({ message: error.message });
  }
});

// Mount the tables router under the /tables path
router.use("/tables", tablesRouter);

module.exports = router;
