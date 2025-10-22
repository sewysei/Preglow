import { GoogleGenAI } from "@google/genai";
import ChatMessage from "../../models/ChatMessages.js";
import checkToken from "../../middleware/auth.js";
import { isBlacklisted } from "../../middleware/auth.js";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.CHATBOT_API_KEY });

export const chatbot = async (req, res) => {
  try {
    const { message } = req.body;
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

    if (!message) {
      return res.status(400).json({ message: "Message is required." });
    }

    const historyDocs = await ChatMessage.find({ userId })
      .sort({ createdAt: 1 })
      .limit(50);

    const historyForGemini = historyDocs.map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    }));

    const systemPrompt = {
      role: "user",
      parts: [
        {
          text: `
          Jawablah hanya pertanyaan seputar kehamilan, nutrisi selama kehamilan,
          makanan untuk ibu hamil, mengenai bayi dan awal mula kehamilan.
          Jika pertanyaan di luar topik, tolak secara sopan dengan mengatakan 
          "Maaf, saya hanya bisa menjawab pertanyaan seputar kehamilan dan nutrisi selama kehamilan."
          Jangan gunakan format markdown seperti cetak tebal (**) atau miring (*).
          Jangan gunakan frasa pembuka seperti "Tentu" atau "Berikut adalah".
          Jangan gunakan tanda kutip tiga (\`\`\`). Jawaban tidak lebih dari 300 kata. 
          Jika jawaban dalam bentuk daftar (list), berikan penanda angka (1., 2., 3.).`,
        },
      ],
    };

    const contents = [
      systemPrompt,
      ...historyForGemini,
      {
        role: "user",
        parts: [{ text: message }],
      },
    ];

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
      config: {
        systemInstruction:
          "Kamu adalah asisten untuk ibu hamil bernama SARA AI.",
      },
    });

    const reply = result?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      return res.status(500).json({ error: "Tidak ada respons dari Gemini." });
    }

    await ChatMessage.create({ userId, role: "user", text: message });
    await ChatMessage.create({ userId, role: "bot", text: reply });

    res.status(200).json({ reply });
  } catch (error) {
    res.status(500).json({
      message: "A server error occurred: " + error.message,
    });
  }
};
