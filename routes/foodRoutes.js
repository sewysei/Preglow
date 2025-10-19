import { addFood } from "../handler/food/addfood.js";
import express from "express";
import { getDailyNutrition } from "../handler/food/getdailynutrition.js";
import { getWeeklyCalories } from "../handler/food/getweeklycalories.js";

const router = express.Router();

router.post("/add", addFood);

router.get("/daily-nutrition", getDailyNutrition);

router.get("/weekly-nutrition", getWeeklyCalories);

export default router;
