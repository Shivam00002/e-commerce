import express, { Router, Request, Response } from "express";
import User from "../models/user";

const router: Router = express.Router();

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user: any = await User.findById({ _id: id });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    return res.status(200).json({ message: user.interests });
  } catch (error) {
    console.error("Error fetching user interests:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
