import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user";
import OTP from "../models/opt";
import { generateOTP, SaveOTP, DeleteOTP, SendEmail } from "../utils";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  console.log(req.body);
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    const AlreadySendOTP = await OTP.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: false,
        message: "User Already Exists",
      });
    }
    if (AlreadySendOTP) {
      return res.status(400).json({
        status: false,
        message: "OTP Already Sent, Please Check your email",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpData = {
      username,
      email,
      password: hashedPassword,
      otp,
      expirationSeconds: "10min",
    };
    const otpResult = await SaveOTP(otpData);
    await SendEmail({
      email: otpData.email,
      otp: otpData.otp,
    });

    setTimeout(async () => {
      await DeleteOTP(otpResult.email);
    }, 1000 * 60 * 5);

    const token = jwt.sign(
      { userId: otpResult._id, email: otpResult.email },
      process.env.JWT_SECRET!,
      {
        expiresIn: "5m",
      }
    );

    res.status(201).json({ status: true, message: "OTP sent", token });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
