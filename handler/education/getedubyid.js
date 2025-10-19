import Education from "../../models/Education.js";

export const getEducationById = async (req, res) => {
  try {
    const { id } = req.params;

    const education = await Education.findById(id);

    if (!education) {
      return res.status(404).json({ message: "Education not found" });
    }

    res.status(200).json({
      message: "Success fetching education by id",
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
