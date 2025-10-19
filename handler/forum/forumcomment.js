import Comment from "../../models/Comment.js";

export const listForumComment = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({
      message: "A server error occurred: " + error.message,
    });
  }
};
