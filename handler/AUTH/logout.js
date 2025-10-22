import User from "../../models/Users.js";
import checkToken from "../../middleware/auth.js";
import BlacklistToken from "../../models/BlacklistToken.js";

export const logout = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "There is no Token sent!",
      });
    }

    const token = authHeader.split(" ")[1];
    const { valid, expired, decoded } = checkToken(token);

    if (!valid) {
      return res.status(401).json({
        message: expired ? "Token expired." : "Token invalid.",
      });
    }

    const userId = decoded.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    await BlacklistToken.create({
      token,
      expiredAt: new Date(decoded.exp * 1000),
    });

    console.log(`User ${user.username} logged out and token blacklisted.`);

    return res.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    res.status(500).json({
      message: "A server error occurred: " + error.message,
    });
  }
};
