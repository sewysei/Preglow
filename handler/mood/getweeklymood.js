import { getMood } from "./getmood.js";

export const getWeeklyMood = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized. User ID missing." });
    }

    const mood = await getMood(userId, 7);

    return res.status(200).json({
      message: "Successfully fetched mood data for the past 7 days.",
      mood_count: mood,
    });
  } catch (error) {
    console.error("Error fetching weekly mood:", error);
    res
      .status(500)
      .json({ message: "A server error occurred while fetching weekly mood." });
  }
};
