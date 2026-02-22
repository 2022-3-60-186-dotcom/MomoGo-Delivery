import dns from "dns";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDb from "./db.js";
import authRoutes from "./routes/auth.js";
import menuRoutes from "./routes/menu.js";
import cartRoutes from "./routes/cart.js";
import ordersRoutes from "./routes/orders.js";
import notificationsRoutes from "./routes/notifications.js";
import usersRoutes from "./routes/users.js";

// Force Node.js to use Google DNS
dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config();

const PORT = process.env.PORT || 4000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:8080";

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is not set");
  process.exit(1);
}

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
  })
);

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/users", usersRoutes);

connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`API listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  });
