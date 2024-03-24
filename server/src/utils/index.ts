import { Transporter } from "../config/nodemailer";
import OTP from "../models/opt";
export const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000);
};
export const DeleteOTP = async (email: string) => {
  return await OTP.findOneAndDelete({ email });
};
export const SaveOTP = async (data: {
  otp: number;
  email: string;
  expirationSeconds: string;
  username: string;
  password: string;
}) => {
  const save = new OTP(data);
  await save.save();
  return save;
};

export const SendEmail = async (data: { email: string; otp: number }) => {
  try {
    const info = await Transporter.sendMail({
      from: "ajaysehwal786@gmail.com", // sender address
      to: data.email, // list of receivers
      subject: "Email Verification", // Subject line
      text: "Hello world?", // plain text body
      html: `<b>${data.otp}</b>`, // html body
    });
    return info;
  } catch (err) {
    return err;
  }
};
