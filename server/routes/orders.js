import express from "express";
import Order from "../models/Order.js";
import OrderStatusHistory from "../models/OrderStatusHistory.js";
import Notification from "../models/Notification.js";
import Cart from "../models/Cart.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// All order routes require authentication
router.use(requireAuth);

// Create new order from cart
router.post("/", async (req, res) => {
  try {
    const { customerInfo } = req.body;

    // Validation
    if (!customerInfo || !customerInfo.name || !customerInfo.phone || !customerInfo.email || !customerInfo.address || !customerInfo.city) {
      return res.status(400).json({ error: "Missing required customer information" });
    }

    // Get user's cart
    const cart = await Cart.findOne({ userId: req.user.id }).populate("items.menuItemId");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // Calculate total and prepare order items
    let totalAmount = 0;
    const orderItems = cart.items.map((item) => {
      const itemTotal = item.menuItemId.price * item.quantity;
      totalAmount += itemTotal;
      return {
        menuItemId: item.menuItemId._id,
        name: item.menuItemId.name,
        price: item.menuItemId.price,
        quantity: item.quantity,
      };
    });

    // Create order
    const order = new Order({
      userId: req.user.id,
      items: orderItems,
      customerInfo,
      totalAmount,
      status: 'pending',
    });

    await order.save();

    // Create initial status history
    const statusHistory = new OrderStatusHistory({
      orderId: order._id,
      status: 'pending',
      updatedBy: req.user.id,
      notes: 'Order placed',
    });
    await statusHistory.save();

    // Create notification
    const notification = new Notification({
      userId: req.user.id,
      type: 'order_status',
      title: 'Order Placed Successfully',
      message: `Your order #${order._id.toString().slice(-6)} has been placed and is pending confirmation.`,
      relatedOrderId: order._id,
    });
    await notification.save();

    // Clear cart
    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// Get user's orders (or all orders for admin)
router.get("/", async (req, res) => {
  try {
    let query = {};

    // If not admin, only show user's own orders
    if (req.user.role !== "admin") {
      query.userId = req.user.id;
    }

    const orders = await Order.find(query)
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// Get single order details
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("userId", "name email phone")
      .populate("items.menuItemId");

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Check if user has permission to view this order
    if (req.user.role !== "admin" && order.userId._id.toString() !== req.user.id) {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ error: "Failed to fetch order" });
  }
});

// Update order status (admin only)
router.put("/:id/status", async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const { status, notes } = req.body;

    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Update order status
    order.status = status;
    await order.save();

    // Create status history entry
    const statusHistory = new OrderStatusHistory({
      orderId: order._id,
      status,
      updatedBy: req.user.id,
      notes: notes || `Status updated to ${status}`,
    });
    await statusHistory.save();

    // Create notification for customer
    const statusMessages = {
      confirmed: 'Your order has been confirmed and will be prepared soon.',
      preparing: 'Your order is being prepared.',
      out_for_delivery: 'Your order is out for delivery!',
      delivered: 'Your order has been delivered. Enjoy your meal!',
      cancelled: 'Your order has been cancelled.',
    };

    if (statusMessages[status]) {
      const notification = new Notification({
        userId: order.userId,
        type: 'order_status',
        title: `Order ${status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ')}`,
        message: statusMessages[status],
        relatedOrderId: order._id,
      });
      await notification.save();
    }

    res.json(order);
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ error: "Failed to update order status" });
  }
});

// Get order status history
router.get("/:id/history", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Check if user has permission
    if (req.user.role !== "admin" && order.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Access denied" });
    }

    const history = await OrderStatusHistory.find({ orderId: req.params.id })
      .populate("updatedBy", "name email")
      .sort({ createdAt: -1 });

    res.json(history);
  } catch (error) {
    console.error("Error fetching order history:", error);
    res.status(500).json({ error: "Failed to fetch order history" });
  }
});

export default router;
