import User from "../../models/Users.js";

export const getUserInfo = async (req, res) => {
  try {
    const userId = req.userId;

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

    const pregnancyStr = user?.pregnancy_date?.toString();

    if (!pregnancyStr || pregnancyStr.length < 8) {
      return res.status(400).json({
        status: "Failed",
        message:
          "Invalid or missing 'pregnancy_date'. Expected format: 'ddmmyyyy'.",
      });
    }

    const day = pregnancyStr.slice(0, 2);
    const month = pregnancyStr.slice(2, 4);
    const year = pregnancyStr.slice(4, 8);

    const startDate = new Date(`${year}-${month}-${day}`);

    if (isNaN(startDate.getTime())) {
      return res.status(400).json({
        status: "Failed",
        message: "Invalid date format in 'pregnancy_date'.",
      });
    }

    const currentDate = new Date();
    const diffTime = Math.abs(currentDate - startDate);
    const pregnancyWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));

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
