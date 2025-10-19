import Forum from "../../models/Forum.js";
import checkToken from "../../middleware/auth.js";
import { isBlacklisted } from "../../middleware/auth.js";

export const addForum = async (req, res) => {
  try {
    const { title, question } = req.body;
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
    if (!title || !question) {
      return res
        .status(400)
        .json({ message: "Title and question are required." });
    }

    let photoUrl = null;
    if (req.file) {
      const baseUrl = `${req.protocol}://${req.get("host")}`;
      photoUrl = `${baseUrl}/uploads/${req.file.filename}`;
    }

    const newForum = new Forum({
      title,
      question,
      photo: photoUrl,
      userId,
    });

    await newForum.save();

    return res.status(200).json({
      message: "Success adding new forum!",
      title: newForum.title,
      question: newForum.question,
    });
  } catch (error) {
    res.status(500).json({
      message: "A server error occurred: " + error.message,
    });
  }
};
