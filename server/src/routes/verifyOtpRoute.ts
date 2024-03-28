import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";
import OTP from "../models/opt";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  console.log(email, otp);
  try {
    const user = await OTP.findOne({ email });
    if (user?.otp === Number(otp)) {
      const newUser = new User({
        username: user?.username,
        email: user?.email,
        password: user?.password,
      });
      await newUser.save();
      const token = jwt.sign(
        { userId: user?._id, username: user?.username },
        process.env.JWT_SECRET!,
        {
          expiresIn: "15d",
        }
      );
      res.cookie("token", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: false,
        sameSite: "lax",
      });
      res
        .status(201)
        .json({ status: true, message: "User Successfully Registered" });
    } else {
      res.status(401).json({
        status: false,
        message: "Your OTP expired, please send again",
      });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
