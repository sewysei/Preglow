import express from "express";
import { addDailyMood } from "../handler/mood/adddailymood.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/daily", authenticateToken, addDailyMood);

export default router;
