import User from "../../models/Users.js";
import sendEmail from "./sendmail.js";
import crypto from "crypto";

export const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required!" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const resetToken = Math.floor(1000 + Math.random() * 9000).toString();
    const resetTokenExpires = Date.now() + 10 * 60 * 1000;

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpires;
    await user.save();

    res.cookie("resetTokenEmail", email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 10 * 60 * 1000, // 10 minutes
    });
    try {
      const emailHtml = `<div style="font-family: Arial, sans-serif; text-align: center; color: #333;"></div>
          <h2>Password Reset Request</h2>
          <p>You requested to reset your password. Use the following code to reset it:</p>
            <p style="font-size: 24px; font-weight: bold; letter-spacing: 5px; background-color: #f0f0f0; padding: 10px; border-radius: 5px;">
                ${resetToken}
            </p>
          <p>This code will expire in 10 minutes.</p>
          <p>If you did not request a password reset, please ignore this email.</p>
        </div>
      `;
      await sendEmail({
        email: user.email,
        subject: "Password Reset Code",
        html: emailHtml,
      });
      res.status(200).json({
        message: "Password reset code sent to your email.",
      });
    } catch (emailError) {
      console.error(emailError);
      return res.status(500).json({ message: "Failed to send email." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "A server error occurred." });
  }
};
