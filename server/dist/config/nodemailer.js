"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transporter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
exports.Transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: "dubey02shiv@gmail.com",
        pass: "jcqbypjftadztasb",
    },
});
