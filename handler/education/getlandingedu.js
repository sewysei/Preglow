import Education from "../../models/Education.js";

export const getLandingEdu = async (req, res) => {
  try {
    const educations = await Education.find()
      .select("title description -_id") // exclude _id field
      .sort({ createdAt: 1 });

    res.status(200).json(educations);
  } catch (error) {
    res.status(500).json({
      message: "A server error occurred: " + error.message,
    });
  }
};
