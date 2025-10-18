import express from "express";
import { addDailyMood } from "../handler/mood/adddailymood.js";
import { getWeeklyMood } from "../handler/mood/getweeklymood.js";
import { getMonthlyMood } from "../handler/mood/getmonthlymood.js";

const router = express.Router();

router.post("/add-feelings", addDailyMood);

router.get("/weekly-mood", getWeeklyMood);

router.get("/monthly-mood", getMonthlyMood);

export default router;
