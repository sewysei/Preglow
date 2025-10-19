import mongoose from "mongoose";
import Mood from "../../models/Mood.js";

export const getMood = async (userId, duration) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - duration);

    console.log("Filtering moods from:", startDate.toISOString());

    const result = await Mood.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          count: 1,
        },
      },
    ]);

    const total = result.reduce((sum, item) => sum + item.count, 0);

    return { result, total };
  } catch (error) {
    res.status(500).json({
      message: "A server error occurred: " + error.message,
    });
  }
};
