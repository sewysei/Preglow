import { addEducation } from "../handler/education/addedu.js";
import { addAffirmation } from "../handler/affirmation/addafir.js";
import { addFAQ } from "../handler/faq/addfaq.js";
import { addFoodCategory } from "../handler/food/addfoodctgr.js";
import { addMoodCategory } from "../handler/mood/addmoodctgr.js";
import express from "express";

const router = express.Router();

router.post("/education", addEducation);

router.post("/faq", addFAQ);

router.post("/affirmation", addAffirmation);

router.post("/food-category", addFoodCategory);

router.post("/mood-category", addMoodCategory);

export default router;
