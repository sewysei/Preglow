import User from "../../models/Users.js";
import sendEmail from "./sendmail.js";

export const resetPassword = async (req, res) => {
  try {
    const { newPassword, email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required!" });
    }

    if (!newPassword) {
      return res.status(400).json({ message: "New password is required!" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    user.password = newPassword;
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
      return res.status(500).json({ message: "Failed to send email." });
    }
  } catch (error) {
    res.status(500).json({
      message: "A server error occurred: " + error.message,
    });
  }
};
