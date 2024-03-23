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
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = (0, express_1.default)();
        const server = http_1.default.createServer(app);
        const PORT = process.env.PORT || 8000;
        const whitelist = ["http://localhost:3000"];
        const corsOptions = {
            origin: function (origin, callback) {
                if (!origin || whitelist.indexOf(origin) !== -1) {
                    callback(null, true);
                }
                else {
                    callback(new Error("Not allowed by CORS"));
                }
            },
            credentials: true,
            optionsSuccessStatus: 200,
        };
        app.use((0, cors_1.default)(corsOptions));
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
        app.post("/register", (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, email, password } = req.body;
                const existingUser = yield user_1.default.findOne({ email });
                if (existingUser) {
                    return res.status(400).json({ message: "User already exists" });
                }
                // Hash the password before saving it to the database
                const hashedPassword = yield bcrypt_1.default.hash(password, 10);
                const newUser = new user_1.default({ username, email, password: hashedPassword });
                yield newUser.save();
                res.status(201).json({ message: "User registered successfully" });
            }
            catch (error) {
                console.error("Error registering user:", error);
                res.status(500).json({ message: "Internal server error" });
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
                // Generate JWT token
                const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
                // Set the token as a cookie
                res.cookie("token", token, { httpOnly: true });
                res.status(200).json({ message: "Login successful", token });
            }
            catch (error) {
                console.error("Error logging in:", error);
                res.status(500).json({ message: "Internal server error" });
            }
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
