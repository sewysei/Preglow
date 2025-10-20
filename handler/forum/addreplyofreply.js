import Reply from "../../models/Reply.js";
import ReplyOfReply from "../../models/Replyofreply.js";
import checkToken from "../../middleware/auth.js";
import { isBlacklisted } from "../../middleware/auth.js";

export const addReplyOfReply = async (req, res) => {
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

    const replyId = req.params.id;

    const checkReply = await Reply.findById(replyId);
    if (!checkReply) {
      return res.status(404).json({
        message: "Reply not found !",
      });
    }

    const newReofRe = new ReplyOfReply({
      userId,
      replyId,
      content,
    });

    const savedReofRe = await newReofRe.save();
    return res.status(200).json({
      message: "Success adding reply!",
      savedReofRe,
    });
  } catch (error) {
    res.status(500).json({
      message: "A server error occurred: " + error.message,
    });
  }
};
