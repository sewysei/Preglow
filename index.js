import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { connectDB } from "./database.js";
import authRoutes from "./routes/authRoutes.js";
import landingRoutes from "./routes/landingRoutes.js";
import addDataRoutes from "./routes/addDataRoutes.js";
import dashbordRoutes from "./routes/dashboardRoutes.js";
import chatbotRoutes from "./routes/chatbotRoutes.js";
import foodRoutes from "./routes/foodRoutes.js";
import moodRoutes from "./routes/moodRoutes.js";
import forumRoutes from "./routes/forumRoutes.js";

dotenv.config();
const app = express();
app.use(cookieParser());
app.use(express.json());
await connectDB();

app.use("/uploads", express.static("uploads"));

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

const PORT = process.env.PORT;

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Server is running",
  });
});

app.use("/auth", authRoutes);

app.use("/add", addDataRoutes);

app.use("/landing", landingRoutes);

app.use("/dashboard", dashbordRoutes);

app.use("/menu/chatbot", chatbotRoutes);

app.use("/menu/food", foodRoutes);

app.use("/menu/mood", moodRoutes);

app.use("/menu/forum", forumRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
