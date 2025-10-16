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

dotenv.config();
const app = express();
app.use(cookieParser());
app.use(express.json());
connectDB();

// const origins = ["http://localhost:3000", "https://.vercel.app"];

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       if (!origin) return callback(null, true);

//       if (origins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//   })
// );

const PORT = process.env.PORT;

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Server is running",
  });
});

app.use("/auth", authRoutes);

app.use("/landing", landingRoutes);

app.use("/add", addDataRoutes);

app.use("/dashboard", dashbordRoutes);

app.use("/menu/chatbot", chatbotRoutes);

app.use("/menu/food", foodRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
