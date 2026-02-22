import express from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import PasswordResetToken from "../models/PasswordResetToken.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();
const COOKIE_NAME = "momogo_token";
const TOKEN_TTL_DAYS = 7;
const RESET_TOKEN_MINUTES = 30;

const getAdminEmails = () => {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
};

const sanitizeUser = (user) => ({
  id: user._id.toString(),
  email: user.email,
  name: user.name,
  phone: user.phone || "",
  role: user.role,
});

const setAuthCookie = (res, token) => {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000,
  });
};

const clearAuthCookie = (res) => {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
};

router.post("/signup", async (req, res) => {
  try {
    const { email, password, name, phone } = req.body ?? {};

    if (!email || !password || !name) {
      return res.status(400).json({ message: "Email, password, and name are required" });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    const normalizedEmail = email.toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({ message: "Email is already registered" });
    }

    const adminEmails = getAdminEmails();
    const role = adminEmails.includes(normalizedEmail) ? "admin" : "customer";
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      email: normalizedEmail,
      passwordHash,
      name,
      phone,
      role,
    });

    const token = jwt.sign(
      { sub: user._id.toString(), role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: `${TOKEN_TTL_DAYS}d` }
    );

    setAuthCookie(res, token);
    return res.json({ user: sanitizeUser(user) });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Unable to create account" });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body ?? {};

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { sub: user._id.toString(), role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: `${TOKEN_TTL_DAYS}d` }
    );

    setAuthCookie(res, token);
    return res.json({ user: sanitizeUser(user) });
  } catch (error) {
    console.error("Signin error:", error);
    return res.status(500).json({ message: "Unable to sign in" });
  }
});

router.post("/signout", (req, res) => {
  clearAuthCookie(res);
  return res.json({ ok: true });
});

router.get("/me", requireAuth, (req, res) => {
  return res.json({ user: sanitizeUser(req.user) });
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body ?? {};

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.json({ ok: true });
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
    const expiresAt = new Date(Date.now() + RESET_TOKEN_MINUTES * 60 * 1000);

    await PasswordResetToken.create({
      userId: user._id,
      tokenHash,
      expiresAt,
    });

    const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:8080";
    console.log(
      `Password reset link for ${user.email}: ${clientOrigin}/reset-password?token=${rawToken}`
    );

    return res.json({ ok: true });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({ message: "Unable to send reset email" });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body ?? {};

    if (!token || !password) {
      return res.status(400).json({ message: "Token and password are required" });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const tokenDoc = await PasswordResetToken.findOne({
      tokenHash,
      expiresAt: { $gt: new Date() },
    });

    if (!tokenDoc) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await User.updateOne({ _id: tokenDoc.userId }, { $set: { passwordHash } });
    await PasswordResetToken.deleteMany({ userId: tokenDoc.userId });

    return res.json({ ok: true });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ message: "Unable to reset password" });
  }
});

export default router;
