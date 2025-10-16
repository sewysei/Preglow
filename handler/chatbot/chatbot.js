import { GoogleGenAI } from "@google/genai";
import ChatMessage from "../../models/ChatMessages.js";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.CHATBOT_API_KEY });

export const chatbot = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.userId;

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized. User ID is missing." });
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
          Kamu adalah asisten gizi untuk ibu hamil bernama "SARA AI". Jawablah hanya pertanyaan seputar makanan sehat, 
          rencana makan, nutrisi selama kehamilan dan mengenai kehamilan secara umum. 
          Jika pertanyaan di luar topik, tolak secara sopan dengan mengatakan 
          "Maaf, saya hanya bisa menjawab pertanyaan seputar gizi kehamilan."
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
      model: "gemini-2.0-flash",
      contents: contents,
    });

    const reply = result?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      return res.status(500).json({ error: "Tidak ada respons dari Gemini." });
    }

    await ChatMessage.create({ userId, role: "user", text: message });
    await ChatMessage.create({ userId, role: "bot", text: reply });

    res.status(200).json({ reply });
  } catch (err) {
    res.status(500).json({
      status: "Failed",
      message: `Catch error ${err.message}`,
    });
  }
};
