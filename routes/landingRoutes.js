import { getFAQ } from "../handler/faq/getfaq.js";
import { getLandingEdu } from "../handler/education/getlandingedu.js";
import { getEducationById } from "../handler/education/getedubyid.js";
import { getOthersEducation } from "../handler/education/getothersedu.js";
import express from "express";

const router = express.Router();

router.get("/education", getLandingEdu);

router.get("/education/:id", getEducationById);

router.get("/other-education/:id", getOthersEducation);

router.get("/faq", getFAQ);

export default router;
