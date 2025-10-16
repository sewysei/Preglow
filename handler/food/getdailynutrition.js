import Food from "../../models/Food.js";

export const getDailyNutrition = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized. User ID missing." });
    }

    // Tentukan rentang waktu untuk "hari ini"
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Ambil semua food milik user hari ini
    const foods = await Food.find({
      userId,
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });

    // Hitung total nutrisi
    const nutrition = foods.reduce(
      (acc, food) => {
        acc.calories += food.calories || 0;
        acc.protein += food.protein || 0;
        acc.carbs += food.carbs || 0;
        acc.fat += food.fat || 0;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    res.status(200).json({
      nutrition,
      count: foods.length,
    });
  } catch (error) {
    console.error("Error getting daily nutrition:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
