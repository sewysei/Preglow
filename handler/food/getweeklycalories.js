import Food from "../../models/Food.js";
import mongoose from "mongoose";
import checkToken, { isBlacklisted } from "../../middleware/auth.js";

export const getWeeklyCalories = async (req, res) => {
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
    const userId = decoded?.id;

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

    // --- Hitung range 7 hari terakhir ---
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    // --- Agregasi total kalori per hari ---
    const weeklyCalories = await Food.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          createdAt: { $gte: sevenDaysAgo, $lte: today },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalCalories: { $sum: "$calories" },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          date: "$_id",
          totalCalories: 1,
        },
      },
    ]);

    // --- Buat daftar tanggal (7 hari terakhir) agar yang kosong tetap muncul ---
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const formatted = d.toISOString().split("T")[0];
      dates.push(formatted);
    }

    // --- Gabungkan hasil agar hari tanpa data tetap muncul ---
    const caloriesMap = new Map(
      weeklyCalories.map((item) => [item.date, item.totalCalories])
    );

    const formattedCalories = dates.map((date) => ({
      date,
      totalCalories: `${caloriesMap.get(date) || 0} kcal`,
    }));

    // --- Agregasi tambahan: total kalori per kategori selama seminggu ---
    const categoryCalories = await Food.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          createdAt: { $gte: sevenDaysAgo, $lte: today },
        },
      },
      {
        $group: {
          _id: "$category",
          totalCalories: { $sum: "$calories" },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          totalCalories: 1,
        },
      },
      { $sort: { category: 1 } },
    ]);

    // --- Format akhir ---
    return res.status(200).json({
      message: "Success fetching weekly calories and category breakdown",
      formattedCalories,
      categoryCalories,
    });
  } catch (error) {
    console.error("Error fetching weekly calories:", error);
    res.status(500).json({
      message: "A server error occurred: " + error.message,
    });
  }
};
