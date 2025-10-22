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
      {
        $sort: { category: 1 },
      },
    ]);

    const total = result.length;

    return { result, total };
  } catch (error) {
    console.error("Error in getMood:", error.message);
    throw new Error("A server error occurred: " + error.message);
  }
};
