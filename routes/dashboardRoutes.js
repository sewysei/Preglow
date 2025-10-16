import { getAffirmation } from "../handler/affirmation/getaffir.js";
import { getUserInfo } from "../handler/AUTH/getuserinfo.js";
import { authenticateToken } from "../middleware/auth.js";
import express from "express";

const router = express.Router();

router.get("/affirmation", getAffirmation);

router.get("/user-info", authenticateToken, getUserInfo);

export default router;
