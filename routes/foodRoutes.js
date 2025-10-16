import { addFood } from "../handler/food/addfood.js";
import express from "express";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/add", authenticateToken, addFood);

export default router;
