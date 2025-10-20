import express from "express";
import upload from "../middleware/fileupload.js";
import { addForum } from "../handler/forum/addforum.js";
import { getAllForum } from "../handler/forum/getallforum.js";
import { getForumById } from "../handler/forum/getforumbyid.js";
import { addComment } from "../handler/forum/addcomment.js";
import { getForumComment } from "../handler/forum/getcomment.js";
import { addReplyById } from "../handler/forum/addreplybyid.js";
import { getReplyById } from "../handler/forum/getreplybyid.js";
import { addReplyOfReply } from "../handler/forum/addreplyofreply.js";
import { getReplyOfReply } from "../handler/forum/getreplyofreply.js";
import { deleteForum } from "../handler/forum/deleteforum.js";

const router = express.Router();

router.post("/add", upload.single("photo"), addForum);

router.get("/all", getAllForum);

router.get("/:id", getForumById);

router.post("/add-comment/:id", addComment);

router.get("/get-comment/:id", getForumComment);

router.post("/add-reply/:id", addReplyById);

router.get("/get-reply/:id", getReplyById);

router.post("/add-reofre/:id", addReplyOfReply);

router.get("/get-reofre/:id", getReplyOfReply);

router.delete("/delete/:id", deleteForum);

export default router;
