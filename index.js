import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { connectDB } from "./database.js";

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

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Server is running",
  });
});

app.get("/set-cookie");

app.get("/get-cookie", (req, res) => {
  res.status(200).json(req.cookies);
});

app.get("/clear-cookie", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Cookie is cleared" });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
