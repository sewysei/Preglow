import FoodCategory from "../../models/FoodCategory.js";
import Food from "../../models/Food.js";
import User from "../../models/Users.js";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.FOOD_API_KEY });

export const addFood = async (req, res) => {
  try {
    const { name, category } = req.body;
    const userId = req.userId;

    if (!name || !category) {
      return res
        .status(400)
        .json({ message: "Name and category are required" });
    }

    const categoryDoc = await FoodCategory.findOne({ name: category });
    if (!categoryDoc) {
      return res.status(400).json({ message: "Invalid food category" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(403).json({ message: "Forbidden" });
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
      categoryId: categoryDoc._id,
      name,
      calories,
      protein,
      carbs,
      fat,
    });

    await newFood.save();

    res.status(201).json({
      message: "Food added successfully",
      food: newFood,
    });
  } catch (error) {
    console.error("Error adding food:", error);
    res.status(500).json({ message: "Server error" });
  }
};
