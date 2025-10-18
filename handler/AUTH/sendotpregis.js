import User from "../../models/Users.js";
import sendEmail from "./sendmail.js";

export const sendOTPRegis = async (req, res) => {
  try {
    const email = req.body;
    const user = await User.findOne({ email });
    const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();
    const verificationCodeExpires = Date.now() + 10 * 60 * 1000;

    user.verificationCode = verificationCode;
    user.verificationCodeExpires = verificationCodeExpires;
    await user.save();

    try {
      const emailHtml = `<div style="font-family: Arial, sans-serif; text-align: center; color: #333;">
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
      res.status(200).json({
        message: "Account Verification code sent to your email.",
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
