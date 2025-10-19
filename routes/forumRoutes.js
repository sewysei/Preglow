import express from "express";
import upload from "../middleware/fileupload.js";
import { addForum } from "../handler/forum/addforum.js";
import { getAllForum } from "../handler/forum/getallforum.js";
import { getForumById } from "../handler/forum/getforumbyid.js";

const router = express.Router();

router.post("/add", upload.single("photo"), addForum);

router.get("/all", getAllForum);

router.get("/education/:id", getForumById);

export default router;
