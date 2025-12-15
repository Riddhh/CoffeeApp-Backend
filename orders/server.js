import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

function authRequired(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Missing token" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { sub: payload.sub, email: payload.email };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

// Order schema
const OrderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    items: [{
      name: String,
      price: Number,
      quantity: Number,
      imageUrl: String,
    }],
    total: { type: Number, required: true },
  
    status: {
      type: String,
      enum: ["PAID", "PREPARING", "COMPLETED"],
      default: "PAID",
    },
  
    date: { type: Date, default: Date.now },
  });
const Order = mongoose.model("Order", OrderSchema);

// Create an order (protected)
app.post("/orders", authRequired, async (req, res) => {
  try {
    const order = new Order({ ...req.body, userId: req.user.sub });
    await order.save();
    res.json({ message: "✅ Order saved successfully", order });
  } catch (err) {
    console.error("Order error:", err);
    res.status(500).json({ error: "❌ Failed to save order" });
  }
});

// Get user orders (protected)
app.get("/orders", authRequired, async (req, res) => {
  const orders = await Order.find({ userId: req.user.sub }).sort({ date: -1 });
  res.json(orders);
});

app.get("/health", (req, res) =>
  res.json({ ok: true, db: mongoose.connection.readyState })
);

const PORT = process.env.PORT || 3002;

async function start() {
  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 8000 });
  console.log("✅ Connected to MongoDB (order_db)");
  app.listen(PORT, () => console.log(`🚀 Order Service running on http://localhost:${PORT}`));
}

start().catch((e) => {
  console.error("❌ Failed to start order-service:", e.message);
  process.exit(1);
});
