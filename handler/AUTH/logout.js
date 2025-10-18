import jwt from "jsonwebtoken";
import User from "../../models/Users.js";

export const logout = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      status: "Failed",
      message: "Tidak ada token dikirim.",
    });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const user = await User.findById(userId);
    console.log(`User ${user.username} logged out.`);

    return res.status(200).json({
      status: "Success",
      message: "Logout berhasil.",
    });
  } catch (err) {
    return res.status(401).json({
      status: "Failed",
      message: "Token tidak valid.",
    });
  }
};
