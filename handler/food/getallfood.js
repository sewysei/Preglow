import Food from "../../models/Food.js";
import checkToken from "../../middleware/auth.js";
import { isBlacklisted } from "../../middleware/auth.js";
import mongoose from "mongoose";

export const getAllFood = async (req, res) => {
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
      return res
        .status(401)
        .json({ message: "Token has been invalidated. Please login again." });
    }
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized. User ID is missing.",
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const date = req.query.date;
    let startOfDay, endOfDay, displayDate;

    if (date) {
      const [day, month, year] = date.split("-").map(Number);
      startOfDay = new Date(year, month - 1, day, 0, 0, 0, 0);
      endOfDay = new Date(year, month - 1, day, 23, 59, 59, 999);
      displayDate = date;
    } else {
      startOfDay = null;
      endOfDay = null;
      displayDate = "All Dates";
    }

    const query = { userId: new mongoose.Types.ObjectId(userId) };
    if (startOfDay && endOfDay) {
      query.createdAt = { $gte: startOfDay, $lte: endOfDay };
    }

    const foods = await Food.find(query)
      .select("foodCategory name calories createdAt -_id")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalFoods = await Food.countDocuments(query);
    if (foods.length === 0) {
      return res.status(200).json({
        message: `No food data found for ${displayDate}`,
        page,
        totalPages: 0,
        limit,
        totalFoods: 0,
        foods: [],
      });
    }

    const formattedFoods = foods.map((food) => ({
      category: food.foodCategory,
      name: food.name.trim(),
      calories: `${food.calories} kcal`,
      date: food.createdAt,
    }));

    const totalPages = Math.ceil(totalFoods / limit);

    res.status(200).json({
      currentPage: page,
      totalPages,
      limit,
      totalFoods,
      foods: formattedFoods,
    });
  } catch (error) {
    res.status(500).json({
      message: "A server error occurred: " + error.message,
    });
  }
};
