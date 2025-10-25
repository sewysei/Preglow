import Food from "../../models/Food.js";
import checkToken from "../../middleware/auth.js";
import { isBlacklisted } from "../../middleware/auth.js";
import mongoose from "mongoose";

export const getNutritionByDate = async (req, res) => {
  try {
    const { date } = req.query;
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

    if (await isBlacklisted(token)) {
      return res.status(401).json({
        message: "Token has been invalidated. Please login again.",
      });
    }

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized. User ID is missing.",
      });
    }

    // --- Pastikan date ada ---
    if (!date) {
      return res.status(400).json({
        message: "Missing 'date' query parameter (format: dd/mm/yyyy)",
      });
    }

    // --- Parsing tanggal dari format dd/mm/yyyy ---
    const [day, month, year] = date.split("/").map(Number);
    const startOfDay = new Date(year, month - 1, day, 0, 0, 0, 0);
    const endOfDay = new Date(year, month - 1, day, 23, 59, 59, 999);

    // --- Ambil data nutrisi di tanggal tersebut ---
    const foods = await Food.find({
      userId: new mongoose.Types.ObjectId(userId),
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });

    // --- Jika tidak ada data ---
    if (foods.length === 0) {
      return res.status(200).json({
        message: `No nutrition data found for ${date}`,
        totalNutrition: {
          calories: null,
          protein: null,
          carbs: null,
          fat: null,
        },
      });
    }

    // --- Hitung total ---
    let totalNutrition = foods.reduce(
      (acc, food) => {
        acc.calories += food.calories || 0;
        acc.protein += food.protein || 0;
        acc.carbs += food.carbs || 0;
        acc.fat += food.fat || 0;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    // Jika semua total = 0, ubah jadi null
    const allZero =
      totalNutrition.calories === 0 &&
      totalNutrition.protein === 0 &&
      totalNutrition.carbs === 0 &&
      totalNutrition.fat === 0;

    if (allZero) {
      totalNutrition = {
        calories: null,
        protein: null,
        carbs: null,
        fat: null,
      };
    } else {
      totalNutrition = {
        calories: `${totalNutrition.calories} kcal`,
        protein: `${totalNutrition.protein} g`,
        carbs: `${totalNutrition.carbs} g`,
        fat: `${totalNutrition.fat} g`,
      };
    }

    // --- Response ---
    res.status(200).json({
      message: `Success fetching nutrition data for ${date}`,
      totalNutrition,
    });
  } catch (error) {
    res.status(500).json({
      message: "A server error occurred: " + error.message,
    });
  }
};
