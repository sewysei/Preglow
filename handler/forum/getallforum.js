import Forum from "../../models/Forum.js";
import Comment from "../../models/Comment.js";

export const getAllForum = async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    let forumsQuery = Forum.find()
      .select("title question photo createdAt")
      .sort({ createdAt: -1 });

    if (!isNaN(page) && !isNaN(limit)) {
      const skip = (page - 1) * limit;
      forumsQuery = forumsQuery.skip(skip).limit(limit);
    }

    const forums = await forumsQuery;

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

    let totalForums = 0;
    let totalPages = 1;

    if (!isNaN(page) && !isNaN(limit)) {
      totalForums = await Forum.countDocuments();
      totalPages = Math.ceil(totalForums / limit);
    } else {
      totalForums = forums.length;
    }

    res.status(200).json({
      currentPage: !isNaN(page) ? page : 0,
      totalPages,
      totalForums,
      forums: forumsWithCommentCount,
    });
  } catch (error) {
    res.status(500).json({
      message: "A server error occurred: " + error.message,
    });
  }
};
