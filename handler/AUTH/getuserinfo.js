import User from "../../models/Users.js";
import jwt from "jsonwebtoken";

export const getUserInfo = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        status: "Failed",
        message: "Tidak ada token dikirim.",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized. User ID is missing.",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
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
        status: "Failed",
        message: "Missing 'pregnancy_date'. Expected format: 'dd-mm-yyyy'.",
      });
    }

    const [day, month, year] = pregnancyDateStr.split("/").map(Number);
    const startDate = new Date(year, month - 1, day);

    if (isNaN(startDate.getTime())) {
      return res.status(400).json({
        status: "Failed",
        message:
          "Invalid date format in 'pregnancy_date'. Expected dd/mm/yyyy.",
      });
    }

    const currentDate = new Date();
    const diffTime = currentDate - startDate;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    const pregnancyWeeks = Math.floor(diffDays / 7);

    res.status(200).json({
      username: user.username,
      pregnancy_weeks: pregnancyWeeks,
    });
  } catch (err) {
    res.status(500).json({
      status: "Failed",
      message: `Catch error ${err.message}`,
    });
  }
};
