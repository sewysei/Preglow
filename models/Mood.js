import mongoose, { mongo } from "mongoose";

const moodSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    category: {
      type: String,
      enum: [
        "Happy",
        "Sad",
        "Anxious",
        "Angry",
        "Bored",
        "Irritated",
        "Moody",
        "Sensitive",
        "Tired",
        "Loved",
      ],
      default: "Happy",
    },
    daily_feelings: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Mood = mongoose.model("mood", moodSchema);

export default Mood;
