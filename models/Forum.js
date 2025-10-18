import mongoose from "mongoose";

const forumSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Forum = mongoose.model("forum", forumSchema);

export default Forum;
