import User from "../../models/Users.js";
import sendEmail from "./sendmail.js";
import crypto from "crypto";
import { sendOtp } from "./sendotp.js";

export const resetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const email = req.cookies.resetTokenEmail;

    if (!newPassword) {
      return res.status(400).json({ message: "New password is required!" });
    }

    const user = await User.findOne({ email }).select(
      "+resetPasswordToken resetPasswordExpires"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    if (!user.resetPasswordToken || !user.resetPasswordExpires) {
      return res
        .status(400)
        .json({ message: "No reset token found. Please request a new one." });
    }

    if (user.resetPasswordExpires < Date.now()) {
      return res.status(400).json({
        message: "Reset token has expired. Please request a new one.",
      });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.status(200).json({ message: "Password has been reset successfully." });

    try {
      const emailHtml = `<div style="font-family: Arial, sans-serif; text-align: center; color: #333;"></div>
        <h2>Password Successfully Reset</h2>
        <p>Your password has been successfully reset. If you did not perform this action, please contact our support team immediately.</p>
        <p>Thank you for using our service!</p>
        </div>
        `;
      await sendEmail({
        email: user.email,
        subject: "Password Successfully Reset",
        html: emailHtml,
      });
    } catch (emailError) {
      console.error(emailError);
    }

    if (!user.isVerified) {
      sendOtp;
    }
    await res.clearCookie("resetTokenEmail");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "A server error occurred." });
  }
};
