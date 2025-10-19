import Forum from "../../models/Forum.js";
import Comment from "../../models/Comment.js";

export const getAllForum = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const forums = await Forum.find()
      .select("title question photo createdAt")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const forumIds = forums.map((f) => f._id);

    const commentCounts = await Comment.aggregate([
      { $match: { forumId: { $in: forumIds } } },
      { $group: { _id: "$forumId", totalComment: { $sum: 1 } } },
    ]);

    const commentCountMap = commentCounts.reduce((acc, c) => {
      acc[c._id.toString()] = c.totalComment;
      return acc;
    }, {});

    const forumsWithCommentCount = forums.map((forum) => ({
      ...forum.toObject(),
      totalComment: commentCountMap[forum._id.toString()] || 0,
    }));

    const totalForums = await Forum.countDocuments();
    const totalPages = Math.ceil(totalForums / limit);

    res.status(200).json({
      currentPage: page,
      totalPages,
      limit,
      totalForums,
      forums: forumsWithCommentCount,
    });
  } catch (error) {
    res.status(500).json({
      message: "A server error occurred: " + error.message,
    });
  }
};
