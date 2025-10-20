import { addFood } from "../handler/food/addfood.js";
import express from "express";
import { getDailyNutrition } from "../handler/food/getdailynutrition.js";
import { getWeeklyCalories } from "../handler/food/getweeklycalories.js";
import { getDetailReport } from "../handler/food/getdetailreport.js";
import { getAllFood } from "../handler/food/getallfood.js";

const router = express.Router();

router.post("/add", addFood);

router.get("/daily-nutrition", getDailyNutrition);

router.get("/weekly-nutrition", getWeeklyCalories);

router.get("/report", getDetailReport);

router.get("/all", getAllFood);

export default router;
