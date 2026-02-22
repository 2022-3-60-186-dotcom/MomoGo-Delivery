import express from "express";
import Notification from "../models/Notification.js";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// All notification routes require authentication
router.use(requireAuth);

// Get user's notifications
router.get("/", async (req, res) => {
  try {
    const { limit = 50, skip = 0 } = req.query;

    const notifications = await Notification.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .populate("relatedOrderId", "status totalAmount");

    const total = await Notification.countDocuments({ userId: req.user.id });

    res.json({
      notifications,
      total,
      hasMore: total > parseInt(skip) + notifications.length,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

// Get unread notification count
router.get("/unread-count", async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      userId: req.user.id,
      isRead: false,
    });

    res.json({ count });
  } catch (error) {
    console.error("Error fetching unread count:", error);
    res.status(500).json({ error: "Failed to fetch unread count" });
  }
});

// Mark notification as read
router.put("/:id/read", async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    notification.isRead = true;
    await notification.save();

    res.json(notification);
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ error: "Failed to mark notification as read" });
  }
});

// Mark all notifications as read
router.put("/read-all", async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user.id, isRead: false },
      { isRead: true }
    );

    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    res.status(500).json({ error: "Failed to mark notifications as read" });
  }
});

// Create notification (admin only)
router.post("/", async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const { userId, userIds, type, title, message, relatedOrderId, sendToAll } = req.body;

    if (!type || !title || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    let notifications = [];

    if (sendToAll) {
      // Send to all users
      const users = await User.find({}, '_id');
      notifications = users.map((user) => ({
        userId: user._id,
        type,
        title,
        message,
        relatedOrderId,
      }));
    } else if (userIds && Array.isArray(userIds)) {
      // Send to multiple users
      notifications = userIds.map((uid) => ({
        userId: uid,
        type,
        title,
        message,
        relatedOrderId,
      }));
    } else if (userId) {
      // Send to single user
      notifications = [{
        userId,
        type,
        title,
        message,
        relatedOrderId,
      }];
    } else {
      return res.status(400).json({ error: "Must specify userId, userIds, or sendToAll" });
    }

    const result = await Notification.insertMany(notifications);

    res.status(201).json({
      message: `Created ${result.length} notification(s)`,
      count: result.length,
    });
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({ error: "Failed to create notification" });
  }
});

// Delete notification (user can delete their own)
router.delete("/:id", async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    await notification.deleteOne();

    res.json({ message: "Notification deleted" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ error: "Failed to delete notification" });
  }
});

export default router;
