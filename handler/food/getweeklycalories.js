import Food from "../../models/Food.js";
import mongoose from "mongoose";

export const getWeeklyCalories = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized. User ID missing." });
    }

    const today = new Date();
    today.setHours(23, 59, 59, 999); // Set ke akhir hari ini

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0); // Set ke awal hari ke-7 yang lalu

    const weeklyCalories = await Food.aggregate([
      // Tahap 1: Filter dokumen
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId), // Konversi string ID ke ObjectId
          createdAt: {
            $gte: sevenDaysAgo,
            $lte: today,
          },
        },
      },
      // Tahap 2: Kelompokkan berdasarkan tanggal
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalCalories: { $sum: "$calories" },
        },
      },
      // Tahap 3: Urutkan hasil
      {
        $sort: { _id: 1 },
      },
      // Tahap 4: Ubah format output
      {
        $project: {
          _id: 0,
          date: "$_id",
          totalCalories: "$totalCalories",
        },
      },
    ]);

    return res.status(200).json(weeklyCalories);
  } catch (error) {
    console.error("Failed fetch weekly calories:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};
