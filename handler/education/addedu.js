import Education from "../../models/Education.js";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const addEducation = async (req, res) => {
  try {
    const { title, description, content } = req.body;

    if (!title || !description || !content) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    let photoUrl = null;

    if (req.file && req.file.buffer) {
      // Upload buffer ke Cloudinary
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "education" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      photoUrl = uploadResult.secure_url;
    }

    const newEducation = new Education({
      title,
      description,
      content,
      photo: photoUrl,
    });

    await newEducation.save();

    res.status(201).json({
      message: "Educational content added successfully!",
      education: newEducation,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error: " + error.message,
    });
  }
};
