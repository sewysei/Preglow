import express from "express";
import upload from "../middleware/fileupload.js";
import { addForum } from "../handler/forum/addforum.js";
import { getAllForum } from "../handler/forum/getallforum.js";

const router = express.Router();

router.post("/add", upload.single("photo"), addForum);

router.get("/all", getAllForum);

export default router;
