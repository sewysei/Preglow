import { addFood } from "../handler/food/addfood.js";
import express from "express";
import { getDailyNutrition } from "../handler/food/getdailynutrition.js";
import { getWeeklyCalories } from "../handler/food/getweeklycalories.js";
import { getLastNutrition } from "../handler/food/getlastnutrition.js";

const router = express.Router();

router.post("/add", addFood);

router.get("/daily-nutrition", getDailyNutrition);

router.get("/weekly-nutrition", getWeeklyCalories);

router.get("/last-nutrition", getLastNutrition);

export default router;
