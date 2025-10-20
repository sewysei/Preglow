import Mood from "../../models/Mood.js";
import checkToken from "../../middleware/auth.js";
import { isBlacklisted } from "../../middleware/auth.js";

export const deleteMood = async (req, res) => {
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
    const mood = await Mood.findById(id);
    if (!mood) {
      return res.status(404).json({
        status: "Failed",
        message: "Mood not found.",
      });
    }
    if (mood.userId.toString() !== userId) {
      return res.status(403).json({
        status: "Failed",
        message: "You are not allowed to delete this mood.",
      });
    }

    await Mood.findByIdAndDelete(id);

    return res.status(200).json({
      status: "Success",
      message: "Mood deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      message: "A server error occurred: " + error.message,
    });
  }
};
