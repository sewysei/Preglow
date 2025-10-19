import express from "express";
import upload from "../middleware/fileupload.js";
import { addForum } from "../handler/forum/addforum.js";
import { getAllForum } from "../handler/forum/getallforum.js";
import { getForumById } from "../handler/forum/getforumbyid.js";
import { addComment } from "../handler/forum/addcomment.js";

const router = express.Router();

router.post("/add", upload.single("photo"), addForum);

router.get("/all", getAllForum);

router.get("/:id", getForumById);

router.post("/add-comment/:id", addComment);

export default router;
