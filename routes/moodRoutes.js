import express from "express";
import { addDailyMood } from "../handler/mood/adddailymood.js";
import { authenticateToken } from "../middleware/auth.js";
import { getWeeklyMood } from "../handler/mood/getweeklymood.js";
import { getMonthlyMood } from "../handler/mood/getmonthlymood.js";

const router = express.Router();

router.post("/add-feelings", authenticateToken, addDailyMood);

router.get("/weekly-mood", authenticateToken, getWeeklyMood);

router.get("/monthly-mood", authenticateToken, getMonthlyMood);

export default router;
