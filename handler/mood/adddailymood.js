import Mood from "../../models/Mood.js";
import MoodCategory from "../../models/MoodCategory.js";
import User from "../../models/Users.js";

export const addDailyMood = async (req, res) => {
  try {
    const userId = req.userId;
    const { daily_feelings, moodCategory } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(401)
        .json({ message: "Unauthorized. User ID missing." });
    }

    if (!moodCategory) {
      return res.status(400).json({ message: "Mood Category is required" });
    }

    if (!daily_feelings) {
      return res.status(400).json({ message: "Daily Feelings is required" });
    }

    const moodCheck = await MoodCategory.findOne({ name: moodCategory });
    if (!moodCheck) {
      return res.status(400).json({ message: "Invalid mood category" });
    }

    const cleanData = daily_feelings.trim();

    const newMood = new Mood({
      userId: user._id,
      categoryId: moodCheck._id,
      daily_feelings: cleanData,
    });

    await newMood.save();

    res.status(201).json({
      message: "Daily Feelings added successfully",
      daily_mood: newMood,
    });
  } catch (error) {
    console.error("Failed adding daily mood: ", error);
    return res.status(500).json({ message: "Server Error" });
  }
};
