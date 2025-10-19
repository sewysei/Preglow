import Forum from "../../models/Forum.js";
import Comment from "../../models/Comment.js";

export const getAllForum = async (req, res) => {
  try {
    const forums = await Forum.find()
      .select("title question createdAt")
      .sort({ createdAt: 1 });

    const forumsWithCommentCount = await Promise.all(
      forums.map(async (forum) => {
        const commentCount = await Comment.countDocuments({
          forumId: forum._id,
        });
        return {
          ...forum.toObject(),
          totalComment: commentCount,
        };
      })
    );

    res.status(200).json(forumsWithCommentCount);
  } catch (error) {
    res.status(500).json({
      message: "A server error occurred: " + error.message,
    });
  }
};
