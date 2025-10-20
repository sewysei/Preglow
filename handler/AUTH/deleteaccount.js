import mongoose from "mongoose";
import User from "../../models/Users.js";

export const deleteAcc = async (req, res) => {
  try {
    const { id } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: "Failed",
        message: "Invalid user ID format.",
      });
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({
        status: "Failed",
        message: "User not found.",
      });
    }

    return res.status(200).json({
      status: "Success",
      message: "Account deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      message: "A server error occurred: " + error.message,
    });
  }
};
