import Mood from "../../models/Mood.js";
import User from "../../models/Users.js";

export const addDailyMood = async (req, res) => {
  try {
    const userId = req.userId;
    const { daily_feelings, category } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(401)
        .json({ message: "Unauthorized. User ID missing." });
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
    console.error("Failed adding daily mood: ", error);
    return res.status(500).json({ message: "Server Error" });
  }
};
