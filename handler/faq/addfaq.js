import FAQ from "../../models/FAQ.js";

export const addFAQ = async (req, res) => {
  try {
    const { title, answer } = req.body;
    if (!title || !answer) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const newFAQ = new FAQ({ title, answer });
    await newFAQ.save();
    res.status(201).json({ message: "FAQ added successfully", faq: newFAQ });
  } catch (error) {
    res.status(500).json({
      message: "A server error occurred: " + error.message,
    });
  }
};
