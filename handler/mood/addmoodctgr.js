import MoodCategory from "../../models/MoodCategory.js";

export const addMoodCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }
    const newCategory = new MoodCategory({ name });
    await newCategory.save();
    res.status(201).json({
      message: "Mood category added successfully",
      category: newCategory,
    });
  } catch (error) {
    console.error("Error adding mood category:", error);
    res.status(500).json({ message: "Server error" });
  }
};
