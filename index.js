import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { connectDB } from "./database.js";
import { sendOtp } from "./handler/auth2forgetpass.js";
import { register } from "./handler/auth2/register.js";
import { login } from "./handler/auth2/login.js";
import { forgetPassword } from "./handler/auth2/forgetpass.js";
import { resetPassword } from "./handler/auth2/resetpass.js";
import { verifyRegistration } from "./handler/auth2/verifyregis.js";
import { authenticateToken } from "./middleware/auth.js";
import { logout } from "./handler/auth2/logout.js";
import { chatbot } from "./handler/chatbot2/assistant.js";
import { getChatHistory } from "./handler/chatbot2/chatmsg.js";

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

app.get("/auth/send-otp", sendOtp);

app.post("/auth/reset-password", resetPassword);

app.post("/auth/verify-registration", verifyRegistration);

app.get("/auth/logout", logout);

app.post("/chatbot", authenticateToken, chatbot);

app.get("/chatbot-history", authenticateToken, getChatHistory);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
