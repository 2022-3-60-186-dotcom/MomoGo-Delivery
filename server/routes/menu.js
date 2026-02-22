import express from "express";
import MenuItem from "../models/MenuItem.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// GET all menu items (public)
router.get("/", async (req, res) => {
  try {
    const items = await MenuItem.find({ isAvailable: true }).sort({ category: 1, name: 1 });
    res.json(items);
  } catch (error) {
    console.error("Error fetching menu items:", error);
    res.status(500).json({ error: "Failed to fetch menu items" });
  }
});

// GET single menu item (public)
router.get("/:id", async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: "Menu item not found" });
    }
    res.json(item);
  } catch (error) {
    console.error("Error fetching menu item:", error);
    res.status(500).json({ error: "Failed to fetch menu item" });
  }
});

// POST create menu item (admin only)
router.post("/", requireAuth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const { name, description, price, image, category, isPopular, isSpicy, isAvailable } = req.body;

    // Validation
    if (!name || !description || !price || !image || !category) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const menuItem = new MenuItem({
      name,
      description,
      price,
      image,
      category,
      isPopular: isPopular || false,
      isSpicy: isSpicy || false,
      isAvailable: isAvailable !== undefined ? isAvailable : true,
    });

    await menuItem.save();
    res.status(201).json(menuItem);
  } catch (error) {
    console.error("Error creating menu item:", error);
    res.status(500).json({ error: "Failed to create menu item" });
  }
});

// PUT update menu item (admin only)
router.put("/:id", requireAuth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const { name, description, price, image, category, isPopular, isSpicy, isAvailable } = req.body;

    const menuItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      { name, description, price, image, category, isPopular, isSpicy, isAvailable },
      { new: true, runValidators: true }
    );

    if (!menuItem) {
      return res.status(404).json({ error: "Menu item not found" });
    }

    res.json(menuItem);
  } catch (error) {
    console.error("Error updating menu item:", error);
    res.status(500).json({ error: "Failed to update menu item" });
  }
});

// DELETE menu item (admin only)
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const menuItem = await MenuItem.findByIdAndDelete(req.params.id);

    if (!menuItem) {
      return res.status(404).json({ error: "Menu item not found" });
    }

    res.json({ message: "Menu item deleted successfully" });
  } catch (error) {
    console.error("Error deleting menu item:", error);
    res.status(500).json({ error: "Failed to delete menu item" });
  }
});

export default router;
