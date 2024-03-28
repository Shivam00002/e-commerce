import nodemailer from "nodemailer";
export const Transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "dubey02shiv@gmail.com",
    pass: "jcqbypjftadztasb",
  },
});
