import Education from "../../models/Education.js";

export const getLandingEdu = async (req, res) => {
  try {
    // Add .select() to specify which fields to return
    const educations = await Education.find()
      .select("title description") // <-- This is the line you add
      .sort({ createdAt: -1 });

    res.status(200).json(educations);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
