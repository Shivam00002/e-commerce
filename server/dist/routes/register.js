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
exports.registerRoute = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
const opt_1 = __importDefault(require("../models/opt"));
const utils_1 = require("../utils");
function registerRoute(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(req.body);
        try {
            const { username, email, password } = req.body;
            const existingUser = yield user_1.default.findOne({ email });
            const AlreadySendOTP = yield opt_1.default.findOne({ email });
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
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            const otp = (0, utils_1.generateOTP)();
            const otpData = {
                username,
                email,
                password: hashedPassword,
                otp,
                expirationSeconds: "10min",
            };
            const otpResult = yield (0, utils_1.SaveOTP)(otpData);
            yield (0, utils_1.SendEmail)({
                email: otpData.email,
                otp: otpData.otp,
            });
            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                yield (0, utils_1.DeleteOTP)(otpResult.email);
            }), 1000 * 60 * 5);
            const token = jsonwebtoken_1.default.sign({ userId: otpResult._id, email: otpResult.email }, process.env.JWT_SECRET, {
                expiresIn: "5m",
            });
            res.status(201).json({ status: true, message: "OTP sent", token });
        }
        catch (error) {
            console.error("Error registering user:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    });
}
exports.registerRoute = registerRoute;
