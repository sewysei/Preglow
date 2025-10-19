import Comment from "../../models/Comment.js";

export const addComment = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({
      message: "A server error occurred: " + error.message,
    });
  }
};
