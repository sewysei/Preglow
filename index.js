import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { connectDB } from "./database.js";
import { sendOTP } from "./handler/AUTH/sendotp.js";
import { register } from "./handler/AUTH/register.js";
import { login } from "./handler/AUTH/login.js";
import { forgetPassword } from "./handler/AUTH/forgetpass.js";
import { resetPassword } from "./handler/AUTH/resetpass.js";
import { verifyRegistration } from "./handler/AUTH/verifyregis.js";

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

app.post("/auth/register", register);

app.post("/auth/login", login);

app.post("/auth/forget-password", forgetPassword);

app.get("/auth/send-otp", sendOTP);

app.post("/auth/reset-password", resetPassword);

app.post("/auth/verify-registration", verifyRegistration);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
