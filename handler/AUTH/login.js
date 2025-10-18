import User from "../../models/Users.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide an email and password." });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    if (!user.isVerified) {
      return res
        .status(403)
        .json({ message: "Please verify your email address first." });
    }

    const payload = {
      id: user._id,
      username: user.username,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful.",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        token: token,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "A server error occurred." });
  }
};
