import express from "express";
import Cart from "../models/Cart.js";
import MenuItem from "../models/MenuItem.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// All cart routes require authentication
router.use(requireAuth);

// GET user's cart
router.get("/", async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id }).populate("items.menuItemId");
    
    if (!cart) {
      // Create empty cart if doesn't exist
      cart = new Cart({ userId: req.user.id, items: [] });
      await cart.save();
    }

    res.json(cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
});

// POST add item to cart
router.post("/items", async (req, res) => {
  try {
    const { menuItemId, quantity } = req.body;

    if (!menuItemId || !quantity || quantity < 1) {
      return res.status(400).json({ error: "Invalid menu item or quantity" });
    }

    // Verify menu item exists
    const menuItem = await MenuItem.findById(menuItemId);
    if (!menuItem) {
      return res.status(404).json({ error: "Menu item not found" });
    }

    if (!menuItem.isAvailable) {
      return res.status(400).json({ error: "Menu item is not available" });
    }

    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      // Create new cart
      cart = new Cart({
        userId: req.user.id,
        items: [{ menuItemId, quantity }],
      });
    } else {
      // Check if item already in cart
      const existingItem = cart.items.find(
        (item) => item.menuItemId.toString() === menuItemId
      );

      if (existingItem) {
        // Update quantity
        existingItem.quantity += quantity;
      } else {
        // Add new item
        cart.items.push({ menuItemId, quantity });
      }
    }

    await cart.save();
    await cart.populate("items.menuItemId");

    res.json(cart);
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ error: "Failed to add item to cart" });
  }
});

// PUT update item quantity
router.put("/items/:menuItemId", async (req, res) => {
  try {
    const { menuItemId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: "Invalid quantity" });
    }

    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const item = cart.items.find(
      (item) => item.menuItemId.toString() === menuItemId
    );

    if (!item) {
      return res.status(404).json({ error: "Item not in cart" });
    }

    item.quantity = quantity;
    await cart.save();
    await cart.populate("items.menuItemId");

    res.json(cart);
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({ error: "Failed to update cart item" });
  }
});

// DELETE remove item from cart
router.delete("/items/:menuItemId", async (req, res) => {
  try {
    const { menuItemId } = req.params;

    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.menuItemId.toString() !== menuItemId
    );

    await cart.save();
    await cart.populate("items.menuItemId");

    res.json(cart);
  } catch (error) {
    console.error("Error removing cart item:", error);
    res.status(500).json({ error: "Failed to remove cart item" });
  }
});

// DELETE clear entire cart
router.delete("/", async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    cart.items = [];
    await cart.save();

    res.json(cart);
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ error: "Failed to clear cart" });
  }
});

export default router;
