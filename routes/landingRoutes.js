import { getFAQ } from "../handler/faq/getfaq.js";
import { getLandingEdu } from "../handler/education/getdashboardedu.js";
import express from "express";

const router = express.Router();

router.get("/education", getLandingEdu);

router.get("/faq", getFAQ);

export default router;
