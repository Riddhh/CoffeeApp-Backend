import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./src/routes/auth.routes.js";
import { authRequired } from "./src/middleware/auth.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// routes
app.use("/auth", authRouter);

// protected test route
app.get("/auth/me", authRequired, (req, res) => {
  res.json({ ok: true, user: req.user });
});

app.get("/health", (req, res) => {
  res.json({ ok: true, service: "auth-service" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Auth Service running on http://localhost:${PORT}`);
});
