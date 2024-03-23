import cors, { CorsOptions } from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { DB_connection } from "./config/mongodb";
import "dotenv/config";
import express from "express";
import bcrypt from "bcrypt"; 
import jwt from "jsonwebtoken"; 
import User from "./models/user";

async function startServer() {
  const app = express();
  const server = http.createServer(app);
  const PORT = process.env.PORT || 8000;
  const whitelist = ["http://localhost:3000"];
  const corsOptions: CorsOptions = {
    origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
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

  app.post("/register", async (req, res) => {
    try {
      const { username, email, password } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash the password before saving it to the database
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({ username, email, password: hashedPassword });

      await newUser.save();

      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ message: "Internal server error" });
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

      // Generate JWT token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: "1h" });

      // Set the token as a cookie
      res.cookie("token", token, { httpOnly: true });

      res.status(200).json({ message: "Login successful", token });
    } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

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

startServer();
