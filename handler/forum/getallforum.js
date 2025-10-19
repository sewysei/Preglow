import Forum from "../../models/Forum.js";
import Comment from "../../models/Comment.js";

export const getAllForum = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    // Count total documents
    const totalForums = await Forum.countDocuments();

    // Fetch forums with pagination
    const forums = await Forum.find()
      .select("title question photo createdAt")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .allowDiskUse(true);

    // Add comment counts for each forum
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

    // Return response
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
