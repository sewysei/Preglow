import Reply from "../../models/Reply.js";
import checkToken from "../../middleware/auth.js";
import { isBlacklisted } from "../middleware/auth.js";

export const getReplyById = async (req, res) => {
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

    const commentId = req.params.id;
    const replies = await Reply.find({ commentId })
      .select("content createdAt")
      .sort({ createdAt: 1 });

    return res.status(200).json(replies);
  } catch (error) {
    res.status(500).json({
      message: "A server error occurred: " + error.message,
    });
  }
};
