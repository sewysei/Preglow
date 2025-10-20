import express from "express";
import { register } from "../handler/AUTH/register.js";
import { sendOTPRegis } from "../handler/AUTH/sendotpregis.js";
import { login } from "../handler/AUTH/login.js";
import { forgetPassword } from "../handler/AUTH/forgetpass.js";
import { sendOTP } from "../handler/AUTH/sendotp.js";
import { verifyForgotPass } from "../handler/AUTH/verifyforgot.js";
import { resetPassword } from "../handler/AUTH/resetpass.js";
import { verifyRegistration } from "../handler/AUTH/verifyregis.js";
import { logout } from "../handler/AUTH/logout.js";
import { deleteAcc } from "../handler/AUTH/deleteaccount.js";

const router = express.Router();

router.post("/register", register);

router.post("/verify-registration", verifyRegistration);

router.post("/send-otp-regis", sendOTPRegis);

router.post("/login", login);

router.post("/forget-password", forgetPassword);

router.post("/verify-forgotpass", verifyForgotPass);

router.post("/send-otp-reset", sendOTP);

router.post("/reset-password", resetPassword);

router.post("/logout", logout);

router.delete("/delete", deleteAcc);

export default router;
