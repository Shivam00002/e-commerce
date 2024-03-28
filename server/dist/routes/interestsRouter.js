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
const express_1 = __importDefault(require("express"));
const user_1 = __importDefault(require("../models/user"));
const interestsRouter = express_1.default.Router();
interestsRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { interests, id } = req.body;
    try {
        const user = yield user_1.default.findById(id);
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
        user.interests.push(...interests);
        yield user.save();
        res.status(201).json({ status: true, message: "Successfully Added" });
    }
    catch (error) {
        console.error("Error adding interests:", error);
        res.status(500).json({ status: false, message: "Internal Server Error" });
    }
}));
exports.default = interestsRouter;
