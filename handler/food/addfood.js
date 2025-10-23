import Food from "../../models/Food.js";
import User from "../../models/Users.js";
import { GoogleGenAI } from "@google/genai";
import checkToken, { isBlacklisted } from "../../middleware/auth.js";
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

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
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

    const cleanName = name.trim();
    const sameFood = await Food.findOne({ name: cleanName });

    // Helper untuk pembulatan angka rapi
    const formatNumber = (num) => {
      const rounded = parseFloat(num.toFixed(1));
      return Number.isInteger(rounded) ? Math.round(rounded) : rounded;
    };

    // Jika sudah ada di database, gunakan datanya
    if (sameFood) {
      const newFood = new Food({
        userId: user._id,
        category,
        name: cleanName,
        calories: formatNumber(sameFood.calories),
        protein: formatNumber(sameFood.protein),
        carbs: formatNumber(sameFood.carbs),
        fat: formatNumber(sameFood.fat),
      });
      await newFood.save();

      return res.status(200).json({
        message: "Food added successfully",
        food: newFood,
      });
    }

    // Ambil data nutrisi dari Gemini
    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `
      Berikan saya informasi nutrisi dari makanan bernama "${cleanName}" dalam format JSON dengan atribut
      cari juga kategorinya (Food, Drink, Snack, atau Supplement):
      {
        "kalori": (dalam kkal),
        "protein": (dalam gram),
        "karbohidrat": (dalam gram),
        "lemak": (dalam gram),
        "kategori": dalam string
      }
      Jangan gunakan format markdown atau tanda kutip tiga (\`\`\`).
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

    const calories = formatNumber(parseFloat(nutrition.kalori) || 0);
    const protein = formatNumber(parseFloat(nutrition.protein) || 0);
    const carbs = formatNumber(parseFloat(nutrition.karbohidrat) || 0);
    const fat = formatNumber(parseFloat(nutrition.lemak) || 0);
    const foodCategory = nutrition.kategori || "food";

    const newFood = new Food({
      userId: user._id,
      category,
      foodCategory,
      name: cleanName,
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
    console.error("Error adding food:", error);
    res.status(500).json({
      message: "A server error occurred: " + error.message,
    });
  }
};
