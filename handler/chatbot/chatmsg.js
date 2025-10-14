import ChatMessage from "../../models/ChatMessages.js";

export const getChatHistory = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized. User ID is missing." });
    }

    const history = await ChatMessage.find({ userId }).sort({
      createdAt: "asc",
    });

    if (!history) {
      return res.status(200).json([]);
    }

    res.status(200).json(history);
  } catch (error) {
    console.error("Error fetching chat history:", error);
    res.status(500).json({ message: "An internal server error occurred." });
  }
};
