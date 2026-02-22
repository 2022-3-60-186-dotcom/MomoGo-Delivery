import express from "express";
import User from "../models/User.js";
import Order from "../models/Order.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// All user routes require authentication
router.use(requireAuth);

// Get all users (admin only)
router.get("/", async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const users = await User.find({}, '-passwordHash').sort({ createdAt: -1 });

    // Get order counts for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const orderCount = await Order.countDocuments({ userId: user._id });
        return {
          ...user.toObject(),
          orderCount,
        };
      })
    );

    res.json(usersWithStats);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Get single user details (admin only)
router.get("/:id", async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const user = await User.findById(req.params.id, '-passwordHash');

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get user's orders
    const orders = await Order.find({ userId: req.params.id }).sort({ createdAt: -1 });
    const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    res.json({
      ...user.toObject(),
      orders,
      orderCount: orders.length,
      totalSpent,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

export default router;
