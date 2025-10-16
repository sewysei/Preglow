import { addEducation } from "../handler/education/addedu.js";
import { addAffirmation } from "../handler/affirmation/addafir.js";
import { addFAQ } from "../handler/faq/addfaq.js";
import express from "express";

const router = express.Router();

router.post("/education", addEducation);

router.post("/faq", addFAQ);

router.post("/affirmation", addAffirmation);

export default router;
