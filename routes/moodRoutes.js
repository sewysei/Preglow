import express from "express";
import { addDailyMood } from "../handler/mood/adddailymood.js";
import { getWeeklyMood } from "../handler/mood/getweeklymood.js";
import { getMonthlyMood } from "../handler/mood/getmonthlymood.js";
import { getDailyMood } from "../handler/mood/getdailymood.js";

const router = express.Router();

router.post("/add-feelings", addDailyMood);

router.get("/daily-mood", getDailyMood);

router.get("/weekly-mood", getWeeklyMood);

router.get("/monthly-mood", getMonthlyMood);

export default router;
