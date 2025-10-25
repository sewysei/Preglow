import Food from "../../models/Food.js";
import checkToken, { isBlacklisted } from "../../middleware/auth.js";
import mongoose from "mongoose";

export const getDailyNutrition = async (req, res) => {
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
    const userId = decoded?.id;

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

    // --- Gunakan tanggal dari query jika ada, jika tidak gunakan hari ini ---
    let startOfDay, endOfDay, displayDate;

    if (date) {
      const [day, month, year] = date.split("/").map(Number);
      startOfDay = new Date(year, month - 1, day, 0, 0, 0, 0);
      endOfDay = new Date(year, month - 1, day, 23, 59, 59, 999);
      displayDate = date;
    } else {
      startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      displayDate = startOfDay.toLocaleDateString("id-ID");
    }

    // --- Ambil semua makanan dari tanggal tersebut ---
    const foods = await Food.find({
      userId: new mongoose.Types.ObjectId(userId),
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    }).sort({ createdAt: -1 });

    if (foods.length === 0) {
      return res.status(200).json({
        message: `No nutrition data found for ${displayDate}`,
        totalNutrition: {
          calories: null,
          protein: null,
          carbs: null,
          fat: null,
        },
        lastNutrition: null,
      });
    }

    // --- Hitung total nutrisi ---
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

    // --- Ambil data makanan terakhir hari itu ---
    const lastFood = foods[0]; // karena sudah disortir desc

    const lastNutrition = lastFood
      ? {
          calories: `${lastFood.calories} kcal`,
          protein: `${lastFood.protein} g`,
          carbs: `${lastFood.carbs} g`,
          fat: `${lastFood.fat} g`,
        }
      : null;

    // --- Kirim response ---
    res.status(200).json({
      message: `Success fetching nutrition data for ${displayDate}`,
      totalNutrition,
      lastNutrition,
    });
  } catch (error) {
    res.status(500).json({
      message: "A server error occurred: " + error.message,
    });
  }
};
