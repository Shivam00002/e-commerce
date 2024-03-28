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
exports.verifyOtpRoute = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
const opt_1 = __importDefault(require("../models/opt"));
function verifyOtpRoute(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, otp } = req.body;
        console.log(email, otp);
        try {
            const user = yield opt_1.default.findOne({ email });
            if ((user === null || user === void 0 ? void 0 : user.otp) === Number(otp)) {
                const newUser = new user_1.default({
                    username: user === null || user === void 0 ? void 0 : user.username,
                    email: user === null || user === void 0 ? void 0 : user.email,
                    password: user === null || user === void 0 ? void 0 : user.password,
                });
                yield newUser.save();
                const token = jsonwebtoken_1.default.sign({ userId: user === null || user === void 0 ? void 0 : user._id, username: user === null || user === void 0 ? void 0 : user.username }, process.env.JWT_SECRET, {
                    expiresIn: "15d",
                });
                res.cookie("token", token, {
                    maxAge: 15 * 24 * 60 * 60 * 1000,
                    httpOnly: false,
                    sameSite: "lax",
                });
                res
                    .status(201)
                    .json({ status: true, message: "User Successfully Registered" });
            }
            else {
                res
                    .status(401)
                    .json({ status: false, message: "Your OTP expired, please send again" });
            }
        }
        catch (error) {
            console.error("Error verifying OTP:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    });
}
exports.verifyOtpRoute = verifyOtpRoute;
