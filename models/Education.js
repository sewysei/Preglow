import mongoose from "mongoose";

const educationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    photo: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Education = mongoose.model("education", educationSchema);

export default Education;
