import Affirmation from "../../models/Affirmation.js";

export const addAffirmation = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ message: "Affirmation text is required" });
    }
    const newAffirmation = new Affirmation({ text });
    await newAffirmation.save();
    res.status(201).json({
      message: "Affirmation added successfully",
      affirmation: newAffirmation,
    });
  } catch (err) {
    res.status(500).json({ message: `Server error: ${err.message}` });
  }
};
