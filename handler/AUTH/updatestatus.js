import User from "../../models/Users.js";
import checkToken from "../../middleware/auth.js";

export const changeUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        status: "Failed",
        message: "There is no Token sent!",
      });
    }

    const token = authHeader.split(" ")[1];
    const { valid, expired, decoded } = checkToken(token);
    const userId = decoded.id;
    if (!valid) {
      return res.status(401).json({
        status: "Failed",
        message: expired ? "Token expired." : "Token invalid.",
      });
    }
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
      message: "Success update pregnancy status!",
      username: user.username,
      user_status: status,
    });
  } catch (error) {
    res.status(500).json({
      message: "A server error occurred: " + error.message,
    });
  }
};
