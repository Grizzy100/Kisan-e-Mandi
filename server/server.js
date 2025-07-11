import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./config/db.js";
import { protect } from "./middleware/authMiddleware.js";
import errorHandler from "./middleware/errorHandler.js";

// Route Imports
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import supportRoutes from "./routes/supportRoutes.js";

// import itemRoutes from "./routes/itemRoutes.js"; // if needed later

// Connect to MongoDB
connectDB();


const app = express();

// Core Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Base Route
app.get("/", (req, res) => res.send("API is working"));

// Protected Test Route
// app.get("/api/protected", protect, (req, res) => {
//   res.json({ message: "You are authenticated", user: req.user });
// });

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use("/api/support", supportRoutes);
// app.use("/api/items", itemRoutes); // optional placeholder

// Central Error Handling
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
