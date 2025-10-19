import Forum from "../../models/Forum.js";

export const getForumById = async (req, res) => {
  try {
    const { id } = req.params;

    const forum = await Forum.findById(id);

    if (!forum) {
      return res.status(404).json({ message: "Forum not found" });
    }

    res.status(200).json({
      message: "Success fetching forum by id",
      title: forum.title,
      question: forum.content,
      photo: forum.photo,
    });
  } catch (error) {
    res.status(500).json({
      message: "A server error occurred: " + error.message,
    });
  }
};
