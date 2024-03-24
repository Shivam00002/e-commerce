import nodemailer from "nodemailer";
export const Transporter = nodemailer.createTransport({
  service: 'gmail',
  host:'smtp.gmail.com',
  port:587,
  secure:false,
  auth: {
    user: "ajaysehwal786@gmail.com",
    pass: "qeinrlpyvnoenqip",
  },
});
