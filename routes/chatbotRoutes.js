import { chatbot } from "../handler/chatbot/chatbot.js";
import { getChatHistory } from "../handler/chatbot/chatmsg.js";
import express from "express";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/", authenticateToken, chatbot);

router.get("/history", authenticateToken, getChatHistory);

export default router;
