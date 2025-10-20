import Mood from "../../models/Mood.js";

export const getMoodById = async (req, res) => {
  try {
    const { id } = req.params;
    const mood = await Mood.findById(id);

    if (!mood) {
      return res.status(404).json({ message: "Mood not found" });
    }

    res.status(200).json({
      message: "Success fetching mood by id",
      mood,
    });
  } catch (error) {
    console.error("Error in getMood:", error.message);
    throw new Error("A server error occurred: " + error.message);
  }
};
