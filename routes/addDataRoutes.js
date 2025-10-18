import { addEducation } from "../handler/education/addedu.js";
import { addAffirmation } from "../handler/affirmation/addafir.js";
import { addFAQ } from "../handler/faq/addfaq.js";
import upload from "../middleware/fileupload.js";
import express from "express";

const router = express.Router();

router.post("/education", upload.single("photo"), addEducation);

router.post("/faq", addFAQ);

router.post("/affirmation", addAffirmation);

export default router;
