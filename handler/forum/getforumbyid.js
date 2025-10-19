import Forum from "../../models/Forum.js";

export const getForumById = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({
      message: "A server error occurred: " + error.message,
    });
  }
};
