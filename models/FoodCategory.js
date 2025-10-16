import mongoose from "mongoose";

const foodCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

const FoodCategory = mongoose.model("foodCategory", foodCategorySchema);

export default FoodCategory;
