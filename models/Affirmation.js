import mongoose from "mongoose";

const affirmationSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Affirmation = mongoose.model("affirmation", affirmationSchema);

export default Affirmation;
