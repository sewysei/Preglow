import mongoose from "mongoose";

const foodSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    category: {
      type: String,
      enum: ["Breakfast", "Lunch", "Dinner", "Snack"],
      default: "Snack",
    },
    foodCategory: {
      type: String,
      enum: ["Food", "Drink", "Snack", "Supplement"],
      default: "Food",
    },
    name: {
      type: String,
      required: true,
    },
    calories: {
      type: Number,
      default: 0,
    },
    protein: {
      type: Number,
      default: 0,
    },
    carbs: {
      type: Number,
      default: 0,
    },
    fat: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Food = mongoose.model("food", foodSchema);

export default Food;
