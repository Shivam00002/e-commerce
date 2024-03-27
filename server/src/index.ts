import cors, { CorsOptions } from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { DB_connection } from "./config/mongodb";
import "dotenv/config";
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User, { UserDocument } from "./models/user";
import OTP from "./models/opt";
import { generateOTP, SaveOTP, DeleteOTP, SendEmail } from "./utils";
async function startServer() {
  const app = express();
  const server = http.createServer(app);
  const PORT = process.env.PORT || 8000;
  const whitelist = ["http://localhost:3000"];
  const corsOptions: CorsOptions = {
    origin: function (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void
    ) {
      if (!origin || whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    optionsSuccessStatus: 200,
  };

  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(cookieParser());

  DB_connection();

  app.get("/", (req, res) => {
    res.send({ _response: "Welcome to API" });
  });

  // GET all users
  app.get("/users", async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // GET user by ID
  app.get("/users/:id", async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/register", async (req, res) => {
    console.log(req.body);
    try {
      const { username, email, password } = req.body;

      const existingUser = await User.findOne({ email });
      const AlreadySendOTP = await OTP.findOne({ email });
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
      const hashedPassword = await bcrypt.hash(password, 10);
      const otp = generateOTP();
      const otpData = {
        username,
        email,
        password: hashedPassword,
        otp,
        expirationSeconds: "10min",
      };
      const otpResult = await SaveOTP(otpData);
      await SendEmail({
        email: otpData.email,
        otp: otpData.otp,
      });

      setTimeout(async () => {
        await DeleteOTP(otpResult.email);

       
      }, 1000 * 60 * 5);

      const token = jwt.sign(
        { userId: otpResult._id, email: otpResult.email },
        process.env.JWT_SECRET!,
        {
          expiresIn: "5m",
        }
      );

      res.status(201).json({ status: true, message: "otp send", token });
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app.post("/verifyotp", async (req, res) => {
    const { email, otp } = req.body;
    console.log(email, otp);
    const user = await OTP.findOne({ email });
    if (user?.otp === Number(otp)) {
      const newUser = new User({
        username: user?.username,
        email: user?.email,
        password: user?.password,
      });
      await newUser.save();
      const token = jwt.sign(
        { userId: user?._id, username: user?.username },
        process.env.JWT_SECRET!,
        {
          expiresIn: "15d",
        }
      );
      res.cookie("token", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: false,
        sameSite: "lax",
      });

      res
        .status(201)
        .json({ status: true, message: "User Successfully Register" });
    } else {
      res
        .status(401)
        .json({ status: false, message: "your otp expired,please send again" });
    }
  });

  // Login endpoint
  app.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if the provided password matches the hashed password in the database
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid password" });
      }

      const token = jwt.sign(
        { userId: user._id, username: user.username },
        process.env.JWT_SECRET!,
        {
          expiresIn: "1h",
        }
      );

      res.cookie("token", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: false,
        sameSite: "lax",
      });
      res.status(200).json({ message: "Login successful", token });
    } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app.post("/interests", async (req, res) => {
    const { interests, id } = req.body;
    console.log(req.body)
    const user:any = await User.findById({_id:id });
    if (!user) {
      return res.status(401).json({ message: "User not find" });
    }
    user?.interest.push(interests);
    const check= await user.save();
    res.status(201).json({ status: true, message: "Successfully Added" });
  });
  app.get('/interests',async(req,res)=>{
     const {id}=req.body;
     const user:any = await User.findById({_id:id });
     if (!user) {
      return res.status(401).json({ message: "User not find" });
    }
    return res.status(200).json({message:user.interest})

  })
  app.delete('/interests',async(req,res)=>{
    const {id,deleteinterest}=req.body;
    const user:any = await User.findById({_id:id });
    if (!user) {
      return res.status(401).json({ message: "User not find" });
    }
    user.interests = user.interests.filter((el:string)=>!deleteinterest.includes(el));
    await user.save();
    return res.status(200).json({ message: 'Interests deleted successfully', user });

  })

  const App = server.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
  });
  
  process.on("SIGTERM", () => {
    App.close(() => {
      console.log("Server disconnected gracefully");
      process.exit(0);
    });
  });
}

startServer()