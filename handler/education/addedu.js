import Education from "../../models/Education.js";

export const addEducation = async (req, res) => {
  try {
    const { title, description, content } = req.body;
    if (!title || !description || !content) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    let photoBase64 = null;
    if (req.file) {
      photoBase64 = `data:${
        req.file.mimetype
      };base64,${req.file.buffer.toString("base64")}`;
    }

    const newEducation = new Education({
      title,
      description,
      content,
      photo: photoBase64,
    });
    await newEducation.save();
    res.status(201).json({
      message: "Educational content added successfully!",
      education: newEducation,
    });
  } catch (error) {
    res.status(500).json({
      message: "A server error occurred: " + error.message,
    });
  }
};
