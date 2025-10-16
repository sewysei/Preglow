import { addFood } from "../handler/food/addfood.js";
import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import { getDailyNutrition } from "../handler/food/getdailynutrition.js";
import { getWeeklyCalories } from "../handler/food/getweeklycalories.js";

const router = express.Router();

router.post("/add", authenticateToken, addFood);

router.get("/daily-nutrition", authenticateToken, getDailyNutrition);

router.get("/weekly-nutrition", authenticateToken, getWeeklyCalories);

export default router;
