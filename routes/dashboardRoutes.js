import { getAffirmation } from "../handler/affirmation/getaffir.js";
import { getUserInfo } from "../handler/AUTH/getuserinfo.js";
import { authenticateToken } from "../middleware/auth.js";
import { changeUserStatus } from "../handler/AUTH/updatestatus.js";
import { getWeeklyMood } from "../handler/mood/getweeklymood.js";
import { getMonthlyMood } from "../handler/mood/getmonthlymood.js";
import { addDailyMood } from "../handler/mood/adddailymood.js";
import { getDailyNutrition } from "../handler/food/getdailynutrition.js";
import express from "express";

const router = express.Router();

router.get("/user-info", authenticateToken, getUserInfo);

router.put("/update-status", authenticateToken, changeUserStatus);

router.post("/add-feelings", authenticateToken, addDailyMood);

router.get("/weekly-mood", authenticateToken, getWeeklyMood);

router.get("/monthly-mood", authenticateToken, getMonthlyMood);

router.get("/affirmation", getAffirmation);

router.get("/daily-nutrition", authenticateToken, getDailyNutrition);

export default router;
