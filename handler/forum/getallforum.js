import Forum from "../../models/Forum.js";

export const getAllForum = async (req, res) => {
  try {
    const forums = await Forum.find()
      .select("title question ") // exclude _id field
      .sort({ createdAt: 1 });

    res.status(200).json(forums);
  } catch (error) {
    res.status(500).json({
      message: "A server error occurred: " + error.message,
    });
  }
};
