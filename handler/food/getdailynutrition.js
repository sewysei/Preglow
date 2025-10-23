import Food from "../../models/Food.js";
import checkToken from "../../middleware/auth.js";
import { isBlacklisted } from "../../middleware/auth.js";

export const getDailyNutrition = async (req, res) => {
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

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const foods = await Food.find({
      userId,
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });

    let totalNutrition = foods.reduce(
      (acc, food) => {
        acc.calories += food.calories || 0;
        acc.protein += food.protein || 0;
        acc.carbs += food.carbs || 0;
        acc.fat += food.fat || 0;
        return acc;
      },
      {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
      }
    );

    totalNutrition = {
      calories: `${totalNutrition.calories} kcal`,
      protein: `${totalNutrition.protein} g`,
      carbs: `${totalNutrition.carbs} g`,
      fat: `${totalNutrition.fat} g`,
    };

    const lastFood = await Food.findOne({
      userId,
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    }).sort({ createdAt: -1 });

    const lastNutrition = lastFood
      ? {
          calories: `${lastFood.calories} kcal`,
          protein: `${lastFood.protein} g`,
          carbs: `${lastFood.carbs} g`,
          fat: `${lastFood.fat} g`,
        }
      : null;

    res.status(200).json({
      message: "Success fetching daily nutrition data",
      totalNutrition,
      lastNutrition,
    });
  } catch (error) {
    res.status(500).json({
      message: "A server error occurred: " + error.message,
    });
  }
};
