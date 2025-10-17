import User from "../../models/Users.js";

export const changeUserStatus = async (req, res) => {
  try {
    const userId = req.userId;
    const { status } = req.body;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized. User ID is missing.",
      });
    }
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    const allowedStatuses = ["Pregnant", "Born"];
    if (!allowedStatuses.includes(status)) {
      return res
        .status(400)
        .json({ message: "Invalid pregnancy status value." });
    }

    await User.updateOne({ _id: userId }, { pregnancy_status: status });

    return res.status(200).json({
      status: "Success",
      username: user.username,
      user_status: status,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "A server error occurred." });
  }
};
