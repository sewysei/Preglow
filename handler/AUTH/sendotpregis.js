import User from "../../models/Users.js";
import sendEmail from "./sendmail.js";

export const sendOTPRegis = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();
    const verificationCodeExpires = Date.now() + 10 * 60 * 1000;

    user.verificationCode = verificationCode;
    user.verificationCodeExpires = verificationCodeExpires;
    await user.save();

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
      email: user.email,
      subject: "Account Verification Code",
      html: emailHtml,
    });

    return res.status(200).json({
      message: "Account verification code sent to your email.",
    });
  } catch (error) {
    res.status(500).json({
      message: "A server error occurred: " + error.message,
    });
  }
};
