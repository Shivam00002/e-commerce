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
const usersRoute_1 = __importDefault(require("./routes/usersRoute"));
const registerRoute_1 = __importDefault(require("./routes/registerRoute"));
const verifyOtpRoute_1 = __importDefault(require("./routes/verifyOtpRoute"));
const loginRoute_1 = __importDefault(require("./routes/loginRoute"));
const getUserByIdRoute_1 = __importDefault(require("./routes/getUserByIdRoute"));
const user_1 = __importDefault(require("./models/user"));
const interestsRouter_1 = __importDefault(require("./routes/interestsRouter"));
const getInterestsRouter_1 = __importDefault(require("./routes/getInterestsRouter"));
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = (0, express_1.default)();
        const server = http_1.default.createServer(app);
        const PORT = process.env.PORT || 8000;
        const whitelist = [
            "http://localhost:3000",
            "https://e-commerce-beta-mocha.vercel.app",
        ];
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
        app.use("/users", usersRoute_1.default);
        app.use("/users", getUserByIdRoute_1.default);
        app.use("/register", registerRoute_1.default);
        app.use("/verifyotp", verifyOtpRoute_1.default);
        app.use("/login", loginRoute_1.default);
        app.use("/interests", interestsRouter_1.default);
        app.use("/interests", getInterestsRouter_1.default);
        app.get("/", (req, res) => {
            res.send({ _response: "Welcome to API" });
        });
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
