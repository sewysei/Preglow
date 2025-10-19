import Reply from "../../models/Reply.js";
import checkToken from "../../middleware/auth.js";
import { isBlacklisted } from "../middleware/auth.js";

export const addReplyById = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        status: "Failed",
        message: "There is no Token sent!",
      });
    }
    const token = authHeader.split(" ")[1];
    const { valid, expired, decoded } = checkToken(token);
    const userId = decoded.id;
    if (!valid) {
      return res.status(401).json({
        status: "Failed",
        message: expired ? "Token expired." : "Token invalid.",
      });
    }
    if (await isBlacklisted(token)) {
      return res
        .status(401)
        .json({ message: "Token has been invalidated. Please login again." });
    }
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized. User ID is missing.",
      });
    }

    const { content } = req.body;

    const commentId = req.params.id;

    const newReply = new Reply({
      userId,
      commentId,
      content,
    });

    const savedComment = await newReply.save();
    return res.status(200).json({
      message: "Success adding reply!",
      savedComment,
    });
  } catch (error) {
    res.status(500).json({
      message: "A server error occurred: " + error.message,
    });
  }
};
