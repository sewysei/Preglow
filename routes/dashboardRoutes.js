import { getAffirmation } from "../handler/affirmation/getaffir.js";
import { getUserInfo } from "../handler/AUTH/getuserinfo.js";
import { changeUserStatus } from "../handler/AUTH/updatestatus.js";
import { getDailyNutrition } from "../handler/food/getdailynutrition.js";
import express from "express";

const router = express.Router();

router.get("/user-info", getUserInfo);

router.put("/update-status", changeUserStatus);

router.get("/affirmation", getAffirmation);

router.get("/daily-nutrition", getDailyNutrition);

export default router;
