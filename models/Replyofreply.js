import mongoose from "mongoose";

const replyOfReplySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    replyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "reply",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ReplyOfReply = mongoose.model("replyofreply", replyOfReplySchema);

export default ReplyOfReply;
