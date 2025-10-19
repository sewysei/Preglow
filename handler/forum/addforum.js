import Forum from "../../models/Forum.js";
import User from "../../models/Users.js";
import checkToken from "../../middleware/auth.js";

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
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized. User ID is missing.",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    if (!title) {
      return res.status(400).json({ message: "Title is required!" });
    }
    if (!question) {
      return res.status(400).json({ message: "Question is required!" });
    }

    let photoBase64 = null;

    if (req.file) {
      photoBase64 = `data:${
        req.file.mimetype
      };base64,${req.file.buffer.toString("base64")}`;
    }

    const newForum = new Forum({
      userId: user._id,
      title,
      question,
      photo: photoBase64,
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
