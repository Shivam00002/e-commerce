import mongoose, { Schema } from "mongoose";

const OTPSchema = new Schema(
  {
    email: { type: String, required: true },
    otp: { type: Number, required: true },
    expirationSeconds: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const OTP = mongoose.model("OTP", OTPSchema);
export default OTP;
