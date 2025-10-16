import Affirmation from "../../models/Affirmation.js";

export const getAffirmation = async (req, res) => {
  try {
    const randomAffirmation = await Affirmation.aggregate([
      { $sample: { size: 1 } },
    ]);

    if (!randomAffirmation || randomAffirmation.length === 0) {
      return res.status(404).json({ message: "No affirmation found" });
    }

    res.status(200).json({ affirmation: randomAffirmation[0] });
  } catch (err) {
    res.status(500).json({ message: `Server error: ${err.message}` });
  }
};
