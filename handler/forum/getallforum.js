import Forum from "../../models/Forum.js";
import Comment from "../../models/Comment.js";

export const getAllForum = async (req, res) => {
  try {
    const page = parseInt(req.params.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const totalForums = await Forum.countDocuments();

    const forums = await Forum.find()
      .select("title question photo createdAt")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .allowDiskUse(true);

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

    res.status(200).json({
      currentPage: page,
      totalPages: Math.ceil(totalForums / limit),
      totalForums,
      forums: forumsWithCommentCount,
    });
  } catch (error) {
    res.status(500).json({
      message: "A server error occurred: " + error.message,
    });
  }
};
