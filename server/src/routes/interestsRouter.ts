import express, { Request, Response, Router } from "express";
import User from "../models/user";

const interestsRouter: Router = express.Router();

interestsRouter.post("/", async (req: Request, res: Response) => {
  const { interests, id } = req.body;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    user.interests.push(...interests);
    await user.save();
    res.status(201).json({ status: true, message: "Successfully Added" });
  } catch (error) {
    console.error("Error adding interests:", error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
});

export default interestsRouter;
