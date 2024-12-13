import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { RTMiddleTier } from "./rtMiddleTier";
import { authMiddleware } from "../middleware/auth";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(authMiddleware);

// Initialize RTMiddleTier
const rtMiddleTier = new RTMiddleTier();

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "healthy" });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;
