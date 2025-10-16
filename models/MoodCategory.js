import mongoose from "mongoose";

const moodCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

const MoodCategory = mongoose.model("moodCategory", moodCategorySchema);

export default MoodCategory;
