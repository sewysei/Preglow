import Food from "../../models/Food.js";
import User from "../../models/Users.js";
import { GoogleGenAI } from "@google/genai";
import checkToken from "../../middleware/auth.js";
import { isBlacklisted } from "../../middleware/auth.js";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.FOOD_API_KEY });

export const addFood = async (req, res) => {
  try {
    const { name, category } = req.body;
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
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    if (!name || !category) {
      return res
        .status(400)
        .json({ message: "Name and category are required" });
    }

    const allowedCategory = ["Breakfast", "Lunch", "Dinner", "Snack"];
    if (!allowedCategory.includes(category)) {
      return res.status(400).json({ message: "Invalid food category value." });
    }

    const sameFood = await Food.findOne({ name: name.trim() });

    if (sameFood) {
      const newFood = new Food({
        userId: user._id,
        category,
        name,
        calories: sameFood.calories,
        protein: sameFood.protein,
        carbs: sameFood.carbs,
        fat: sameFood.fat,
      });
      await newFood.save();

      res.status(200).json({
        message: "Food added successfully",
        food: newFood,
      });
    }

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
      Berikan saya informasi nutrisi dari makanan bernama "${name}" dalam format JSON dengan atribut:
      {
        "kalori": (dalam kkal),
        "protein": (dalam gram),
        "karbohidrat": (dalam gram),
        "lemak": (dalam gram)
      }
      Jangan gunakan format markdown seperti cetak tebal (**) atau miring (*).
      Jangan gunakan frasa pembuka seperti "Tentu" atau "Berikut adalah".
      Jangan gunakan tanda kutip tiga (\`\`\`).
      `,
    });

    const textResult = result.text;

    let nutrition;
    try {
      nutrition = JSON.parse(textResult);
    } catch (error) {
      return res.status(500).json({
        message: "Failed to parse nutrition information",
        raw: textResult,
      });
    }

    const calories = parseFloat(nutrition.kalori) || 0;
    const protein = parseFloat(nutrition.protein) || 0;
    const carbs = parseFloat(nutrition.karbohidrat) || 0;
    const fat = parseFloat(nutrition.lemak) || 0;

    const newFood = new Food({
      userId: user._id,
      category,
      name,
      calories,
      protein,
      carbs,
      fat,
    });

    await newFood.save();

    res.status(200).json({
      message: "Food added successfully",
      food: newFood,
    });
  } catch (error) {
    res.status(500).json({
      message: "A server error occurred: " + error.message,
    });
  }
};
