import mongoose, { mongo } from "mongoose";

const moodSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "moodCategory",
      required: true,
    },
    daily_feelings: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Mood = mongoose.model("mood", moodSchema);

export default Mood;
