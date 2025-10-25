import User from "../../models/Users.js";
import sendEmail from "./sendmail.js";
import dotenv from "dotenv";
dotenv.config();

export const register = async (req, res) => {
  try {
    const { username, email, password, pregnancyDate } = req.body;

    if (!username || !email || !password || !pregnancyDate) {
      return res.status(400).json({ message: "All fields are required !" });
    }

    const pregnancyDateStr = pregnancyDate;
    const [day, month, year] = pregnancyDateStr.split("/").map(Number);
    const startDate = new Date(year, month - 1, day);

    if (isNaN(startDate.getTime())) {
      return res.status(400).json({
        message:
          "Invalid date format in 'pregnancy_date'. Expected format: dd/mm/yyyy.",
      });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or Email already in use" });
    }

    if (!/@gmail\.com$/i.test(email)) {
      return res.status(400).json({
        message: "Only Gmail addresses are allowed.",
      });
    }

    const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();

    const newUser = new User({
      username,
      email,
      password,
      pregnancy_date: pregnancyDate,
      verificationCode,
      verificationCodeExpires: Date.now() + 10 * 60 * 1000, // Kode berlaku 10 menit
    });

    const savedUser = await newUser.save();

    try {
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; text-align: center; color: #333;">
          <h2>Welcome to Our Website!</h2>
          <p>Thank you for registering. Please use the following code to verify your account:</p>
          <p style="font-size: 24px; font-weight: bold; letter-spacing: 5px; background-color: #f0f0f0; padding: 10px; border-radius: 5px;">
            ${verificationCode}
          </p>
          <p>This code will expire in 10 minutes.</p>
        </div>
      `;

      await sendEmail({
        email: savedUser.email,
        subject: "Account Verification Code",
        html: emailHtml,
      });

      res.status(201).json({
        message:
          "Registration successful! Please check your email for a verification code.",
        user: {
          id: savedUser._id,
          username: savedUser.username,
          email: savedUser.email,
        },
      });
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      return res.status(500).json({
        message:
          "Registration was successful, but the verification email could not be sent.",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "A server error occurred: " + error.message,
    });
  }
};
