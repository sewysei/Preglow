import Mood from "../../models/Mood.js";
import User from "../../models/Users.js";
import checkToken from "../../middleware/auth.js";

export const addDailyMood = async (req, res) => {
  try {
    const { daily_feelings, category } = req.body;
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

    const allowedCategory = [
      "Happy",
      "Sad",
      "Anxious",
      "Angry",
      "Bored",
      "Irritated",
      "Moody",
      "Sensitive",
      "Tired",
      "Loved",
    ];
    if (!allowedCategory.includes(category)) {
      return res.status(400).json({ message: "Invalid mood category value." });
    }

    if (!daily_feelings) {
      return res.status(400).json({ message: "Daily Feelings is required" });
    }

    const cleanData = daily_feelings.trim();

    const newMood = new Mood({
      userId: user._id,
      category,
      daily_feelings: cleanData,
    });

    await newMood.save();

    res.status(200).json({
      message: "Daily Feelings added successfully",
      daily_mood: newMood,
    });
  } catch (error) {
    res.status(500).json({
      message: "A server error occurred: " + error.message,
    });
  }
};
