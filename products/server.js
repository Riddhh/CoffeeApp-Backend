// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";


dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// 🧩 --- SCHEMAS ---

// Product Schema
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true }
}, { timestamps: true })

const Product = mongoose.model("Product", ProductSchema);



//
// 🧩 --- PRODUCTS & ORDERS ---
//

// Get all products
app.get("/products", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Add a new product
app.post("/products", async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.json(product);
});





//
// 🧩 --- HEALTH CHECK ---
//
app.get("/health", (req, res) =>
  res.json({ ok: true, db: mongoose.connection.readyState })
);

//
// 🧩 --- START SERVER (connect before listening) ---
//
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    if (!process.env.MONGODB_URI)
      throw new Error("❌ MONGODB_URI missing in .env");

    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 8000, // fail fast if not reachable
    });

    console.log("✅ Connected to MongoDB");

    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error("❌ Failed to connect to MongoDB:", err.message);
    process.exit(1);
  }
}

startServer();
