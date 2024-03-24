"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendEmail = exports.SaveOTP = exports.DeleteOTP = exports.generateOTP = void 0;
const nodemailer_1 = require("../config/nodemailer");
const opt_1 = __importDefault(require("../models/opt"));
const generateOTP = () => {
    return Math.floor(1000 + Math.random() * 9000);
};
exports.generateOTP = generateOTP;
const DeleteOTP = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return yield opt_1.default.findOneAndDelete({ email });
});
exports.DeleteOTP = DeleteOTP;
const SaveOTP = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const save = new opt_1.default(data);
    yield save.save();
    return save;
});
exports.SaveOTP = SaveOTP;
const SendEmail = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const info = yield nodemailer_1.Transporter.sendMail({
            from: "ajaysehwal786@gmail.com", // sender address
            to: data.email, // list of receivers
            subject: "Email Verification", // Subject line
            text: "Hello world?", // plain text body
            html: `<b>${data.otp}</b>`, // html body
        });
        return info;
    }
    catch (err) {
        return err;
    }
});
exports.SendEmail = SendEmail;
