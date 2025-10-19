import Forum from "../../models/Forum.js";
import Comment from "../../models/Comment.js";

export const getForumById = async (req, res) => {
  try {
    const { id } = req.params;

    const forum = await Forum.findById(id);

    if (!forum) {
      return res.status(404).json({ message: "Forum not found" });
    }

    const commentCount = await Comment.countDocuments({
      forumId: forum._id,
    });

    res.status(200).json({
      message: "Success fetching forum by id",
      title: forum.title,
      question: forum.content,
      photo: forum.photo,
      totalComments: commentCount,
    });
  } catch (error) {
    res.status(500).json({
      message: "A server error occurred: " + error.message,
    });
  }
};
