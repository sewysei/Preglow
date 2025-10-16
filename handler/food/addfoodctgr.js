import FoodCategory from "../../models/FoodCategory.js";

export const addFoodCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const newCategory = new FoodCategory({ name });
    await newCategory.save();
    res.status(201).json({
      message: "Food category added successfully",
      category: newCategory,
    });
  } catch (error) {
    console.error("Error adding food category:", error);
    res.status(500).json({ message: "Server error" });
  }
};
