import { getAffirmation } from "../handler/affirmation/getaffir.js";
import { getUserInfo } from "../handler/AUTH/getuserinfo.js";
import { changeUserStatus } from "../handler/AUTH/updatestatus.js";
import { getWeeklyMood } from "../handler/mood/getweeklymood.js";
import { getMonthlyMood } from "../handler/mood/getmonthlymood.js";
import { getDailyMood } from "../handler/mood/getdailymood.js";
import { addDailyMood } from "../handler/mood/adddailymood.js";
import { getDailyNutrition } from "../handler/food/getdailynutrition.js";
import express from "express";

const router = express.Router();

router.get("/user-info", getUserInfo);

router.put("/update-status", changeUserStatus);

router.post("/add-feelings", addDailyMood);

router.get("/daily-mood", getDailyMood);

router.get("/weekly-mood", getWeeklyMood);

router.get("/monthly-mood", getMonthlyMood);

router.get("/affirmation", getAffirmation);

router.get("/daily-nutrition", getDailyNutrition);

export default router;
