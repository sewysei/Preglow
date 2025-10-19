import Education from "../../models/Education.js";

export const getEducationById = async (req, res) => {
  try {
    const { id } = req.params;
    const index = parseInt(id); // convert to number

    if (isNaN(index) || index < 0) {
      return res.status(400).json({ message: "Invalid education index" });
    }

    // Skip `index` number of documents, then take 1
    const education = await Education.findOne()
      .sort({ createdAt: 1 }) // oldest first
      .skip(index);

    if (!education) {
      return res.status(404).json({ message: "Education not found" });
    }

    res.status(200).json({
      message: "Success fetching education by index",
      title: education.title,
      photo: education.photo,
      content: education.content,
    });
  } catch (error) {
    res.status(500).json({
      message: "A server error occurred: " + error.message,
    });
  }
};
