import express from "express";
import { register } from "../handler/AUTH/register.js";
import { sendOTPRegis } from "../handler/AUTH/sendotpregis.js";
import { login } from "../handler/AUTH/login.js";
import { forgetPassword } from "../handler/AUTH/forgetpass.js";
import { sendOTP } from "../handler/AUTH/sendotp.js";
import { resetPassword } from "../handler/AUTH/resetpass.js";
import { verifyRegistration } from "../handler/AUTH/verifyregis.js";
import { logout } from "../handler/AUTH/logout.js";

const router = express.Router();

router.post("/register", register);

router.get("/send-otp-regis", sendOTPRegis);

router.post("/login", login);

router.post("/forget-password", forgetPassword);

router.get("/send-otp-reset", sendOTP);

router.post("/reset-password", resetPassword);

router.post("/verify-registration", verifyRegistration);

router.get("/logout", logout);

export default router;
