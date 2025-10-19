import Food from "../../models/Food.js";
import checkToken from "../../middleware/auth.js";
import { isBlacklisted } from "../../middleware/auth.js";

export const getLastNutrition = async (req, res) => {
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

    const lastFood = await Food.findOne({ userId }).sort({ createdAt: -1 });

    if (!lastFood) {
      return res.status(404).json({
        message: "No food entry found for this user.",
      });
    }

    const nutrition = {
      calories: lastFood.calories || 0,
      protein: lastFood.protein || 0,
      carbs: lastFood.carbs || 0,
      fat: lastFood.fat || 0,
    };

    res.status(200).json({
      message: "Success fetching last added food nutrition",
      nutrition,
    });
  } catch (error) {
    res.status(500).json({
      message: "A server error occurred: " + error.message,
    });
  }
};
