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
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const http_1 = __importDefault(require("http"));
const mongodb_1 = require("./config/mongodb");
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("./models/user"));
const opt_1 = __importDefault(require("./models/opt"));
const utils_1 = require("./utils");
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = (0, express_1.default)();
        const server = http_1.default.createServer(app);
        const PORT = process.env.PORT || 8000;
        //const whitelist = ["http://localhost:3000","https://e-commerce-beta-mocha.vercel.app/"];
        // const corsOptions: CorsOptions = {
        //   origin: function (
        //     origin: string | undefined,
        //     callback: (err: Error | null, allow?: boolean) => void
        //   ) {
        //     if (!origin || whitelist.indexOf(origin) !== -1) {
        //       callback(null, true);
        //     } else {
        //       callback(new Error("Not allowed by CORS"));
        //     }
        //   },
        //   credentials: true,
        //   optionsSuccessStatus: 200,
        // };
        app.use((0, cors_1.default)());
        app.use(express_1.default.json());
        app.use((0, cookie_parser_1.default)());
        (0, mongodb_1.DB_connection)();
        app.get("/", (req, res) => {
            res.send({ _response: "Welcome to API" });
        });
        // GET all users
        app.get("/users", (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield user_1.default.find();
                res.status(200).json(users);
            }
            catch (error) {
                console.error("Error fetching users:", error);
                res.status(500).json({ message: "Internal server error" });
            }
        }));
        // GET user by ID
        app.get("/users/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.id;
                const user = yield user_1.default.findById(userId);
                if (!user) {
                    return res.status(404).json({ message: "User not found" });
                }
                res.status(200).json(user);
            }
            catch (error) {
                console.error("Error fetching user:", error);
                res.status(500).json({ message: "Internal server error" });
            }
        }));
        app.post("/register", (req, res) => __awaiter(this, void 0, void 0, function* () {
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
                        message: "OTP Already Send,Please Check your email",
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
                res.status(201).json({ status: true, message: "otp send", token });
            }
            catch (error) {
                console.error("Error registering user:", error);
                res.status(500).json({ message: "Internal server error" });
            }
        }));
        app.post("/verifyotp", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email, otp } = req.body;
            console.log(email, otp);
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
                    .json({ status: true, message: "User Successfully Register" });
            }
            else {
                res
                    .status(401)
                    .json({ status: false, message: "your otp expired,please send again" });
            }
        }));
        // Login endpoint
        app.post("/login", (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const user = yield user_1.default.findOne({ email });
                if (!user) {
                    return res.status(404).json({ message: "User not found" });
                }
                // Check if the provided password matches the hashed password in the database
                const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
                if (!isPasswordValid) {
                    return res.status(401).json({ message: "Invalid password" });
                }
                const token = jsonwebtoken_1.default.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET, {
                    expiresIn: "1h",
                });
                res.cookie("token", token, {
                    maxAge: 15 * 24 * 60 * 60 * 1000,
                    httpOnly: false,
                    sameSite: "lax",
                });
                res.status(200).json({ message: "Login successful", token });
            }
            catch (error) {
                console.error("Error logging in:", error);
                res.status(500).json({ message: "Internal server error" });
            }
        }));
        app.post("/interests", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { interests, id } = req.body;
            console.log(req.body);
            const user = yield user_1.default.findById({ _id: id });
            if (!user) {
                return res.status(401).json({ message: "User not find" });
            }
            user === null || user === void 0 ? void 0 : user.interest.push(interests);
            const check = yield user.save();
            res.status(201).json({ status: true, message: "Successfully Added" });
        }));
        app.get("/interests/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const user = yield user_1.default.findById({ _id: id });
            if (!user) {
                return res.status(401).json({ message: "User not find" });
            }
            return res.status(200).json({ message: user.interest });
        }));
        app.delete("/interests/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { deleteinterest } = req.body;
            const user = yield user_1.default.findById({ _id: id });
            if (!user) {
                return res.status(401).json({ message: "User not find" });
            }
            user.interests = user.interests.filter((el) => !deleteinterest.includes(el));
            yield user.save();
            return res
                .status(200)
                .json({ message: "Interests deleted successfully", user });
        }));
        const App = server.listen(PORT, () => {
            console.log(`Server is running on ${PORT}`);
        });
        process.on("SIGTERM", () => {
            App.close(() => {
                console.log("Server disconnected gracefully");
                process.exit(0);
            });
        });
    });
}
startServer();
