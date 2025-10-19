import { getFAQ } from "../handler/faq/getfaq.js";
import { getLandingEdu } from "../handler/education/getlandingedu.js";
import { getEducationById } from "../handler/education/getedubyid.js";
import express from "express";

const router = express.Router();

router.get("/education", getLandingEdu);

router.get("/education/:id", getEducationById);

router.get("/faq", getFAQ);

export default router;
