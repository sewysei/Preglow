import Forum from "../../models/Forum.js";
import checkToken from "../../middleware/auth.js";
import { isBlacklisted } from "../../middleware/auth.js";

export const deleteForum = async (req, res) => {
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

    const { id } = req.params;
    const forum = await Forum.findById(id);
    if (!forum) {
      return res.status(404).json({
        status: "Failed",
        message: "Forum not found.",
      });
    }
    if (forum.userId.toString() !== userId) {
      return res.status(403).json({
        status: "Failed",
        message: "You are not allowed to delete this forum.",
      });
    }

    await Forum.findByIdAndDelete(id);

    return res.status(200).json({
      status: "Success",
      message: "Forum deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      message: "A server error occurred: " + error.message,
    });
  }
};
