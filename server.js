import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js"; // Note: Add .js extension for local files
import cors from "cors";
import chapterRoutes from "./routes/chapterRoutes.js"; // Add .js extension
import rateLimiter from "./middlewares/rateLimiter.js";

// dotenv configuration
dotenv.config();

// db connection
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(rateLimiter);

// testing api
app.get("/", (req, res) => {
  res.send("Backend is running");
});

//route
app.use("/api/v1", chapterRoutes);

// server running on port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
