import User from "../../models/Users.js";
import sendEmail from "./sendmail.js";

export const verifyRegistration = async (req, res) => {
  try {
    const { verificationCode, email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required!" });
    }

    if (!verificationCode) {
      return res
        .status(400)
        .json({ message: "Verification code is required!" });
    }

    const user = await User.findOne({ email }).select(
      "+verificationCode verificationCodeExpires isVerified"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    if (user.isVerified) {
      return res
        .status(400)
        .json({ message: "User is already verified! Please login" });
    }

    if (user.verificationCode !== verificationCode) {
      return res.status(400).json({ message: "Invalid verification code!" });
    }

    if (user.verificationCodeExpires < Date.now()) {
      const newverificationCode = Math.floor(
        1000 + Math.random() * 9000
      ).toString();
      user.verificationCode = newverificationCode;
      user.verificationCodeExpires = Date.now() + 10 * 60 * 1000;
      await user.save();

      try {
        const emailHtml = `
        <div style="font-family: Arial, sans-serif; text-align: center; color: #333;">
          <h2>Welcome to Our Website!</h2>
          <p>Thank you for registering. Please use the following code to verify your account:</p>
          <p style="font-size: 24px; font-weight: bold; letter-spacing: 5px; background-color: #f0f0f0; padding: 10px; border-radius: 5px;">
            ${newverificationCode}
          </p>
          <p>This code will expire in 10 minutes.</p>
        </div>
      `;

        await sendEmail({
          email: email,
          subject: "Account Verification Code",
          html: emailHtml,
        });
      } catch (emailError) {
        console.error(emailError);
        return res.status(500).json({ message: "Failed to send email." });
      }
      res.status(400).json({
        message:
          "Verification code has expired. A new code has been sent to your email.",
      });
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();
    res.status(200).json({ message: "Account verified successfully!" });
  } catch (error) {
    res.status(500).json({
      message: "A server error occurred: " + error.message,
    });
  }
};
