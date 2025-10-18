import User from "../../models/Users.js";
import checkToken from "../../middleware/auth.js";

export const getUserInfo = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        status: "Failed",
        message: "There is no Token sent!",
      });
    }

    const token = authHeader.split(" ")[1];
    const userId = decoded.id;
    const { valid, expired, decoded } = checkToken(token);
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

    if (user.pregnancy_status === "Born") {
      return res.status(200).json({
        username: user.username,
        user_status: "Born",
      });
    }

    const pregnancyDateStr = user?.pregnancy_date;

    if (!pregnancyDateStr) {
      return res.status(400).json({
        message: "Missing 'pregnancy_date'. Expected format: 'dd/mm/yyyy'.",
      });
    }

    const [day, month, year] = pregnancyDateStr.split("/").map(Number);
    const startDate = new Date(year, month - 1, day);

    if (isNaN(startDate.getTime())) {
      return res.status(400).json({
        message:
          "Invalid date format in 'pregnancy_date'. Expected format: dd/mm/yyyy.",
      });
    }

    const currentDate = new Date();
    const diffTime = currentDate - startDate;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    const pregnancyWeeks = Math.floor(diffDays / 7);

    res.status(200).json({
      message: "Success fetching user information!",
      username: user.username,
      pregnancy_weeks: pregnancyWeeks,
    });
  } catch (error) {
    res.status(500).json({
      message: "A server error occurred: " + error.message,
    });
  }
};
