import Education from "../../models/Education.js";

export const getOthersEducation = async (req, res) => {
  try {
    const { id } = req.params;

    const others = await Education.find({ _id: { $ne: id } })
      .limit(3)
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Successfully fetched other education entries.",
      data: others,
    });
  } catch (error) {
    res.status(500).json({
      message: "A server error occurred: " + error.message,
    });
  }
};
