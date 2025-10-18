import Forum from "../../models/Forum.js";

export const addForum = async (req, res) => {
  try {
    const userId = req.userId;
    const { title, question } = req.body;
  } catch (error) {
    console.error("Error adding forum: ", error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};
