import { chatbot } from "../handler/chatbot/chatbot.js";
import { getChatHistory } from "../handler/chatbot/chatmsg.js";
import express from "express";

const router = express.Router();

router.post("/", chatbot);

router.get("/history", getChatHistory);

export default router;
