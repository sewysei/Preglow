import mongoose from "mongoose";

const blacklistSchema = new mongoose.Schema({
  token: { type: String, required: true },
  expiredAt: { type: Date, required: true }, // waktu token kadaluarsa
});

export default mongoose.model("BlacklistToken", blacklistSchema);
