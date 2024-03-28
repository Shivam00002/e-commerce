import cors, { CorsOptions } from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { DB_connection } from "./config/mongodb";
import "dotenv/config";
import express from "express";
import usersRoute from "./routes/usersRoute";
import registerRoute from "./routes/registerRoute";
import verifyOtpRoute from "./routes/verifyOtpRoute";
import loginRoute from "./routes/loginRoute";
import getUserByIdRoute from "./routes/getUserByIdRoute";

async function startServer() {
  const app = express();
  const server = http.createServer(app);
  const PORT = process.env.PORT || 8000;

  const whitelist = [
    "http://localhost:3000",
    "https://e-commerce-beta-mocha.vercel.app",
  ];
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

  app.use("/users", usersRoute);
  app.use("/users", getUserByIdRoute);
  app.use("/register", registerRoute);
  app.use("/verifyotp", verifyOtpRoute);
  app.use("/login", loginRoute);

  app.get("/", (req, res) => {
    res.send({ _response: "Welcome to API" });
  });

  // app.post("/interests", async (req, res) => {
  //   const { interests, id } = req.body;
  //   console.log(req.body);
  //   const user: any = await User.findById({ _id: id });
  //   if (!user) {
  //     return res.status(401).json({ message: "User not find" });
  //   }
  //   user?.interest.push(interests);
  //   const check = await user.save();
  //   res.status(201).json({ status: true, message: "Successfully Added" });
  // });

  // app.get("/interests/:id", async (req, res) => {
  //   const { id } = req.params;
  //   const user: any = await User.findById({ _id: id });
  //   if (!user) {
  //     return res.status(401).json({ message: "User not find" });
  //   }
  //   return res.status(200).json({ message: user.interest });
  // });
  // app.delete("/interests/:id", async (req, res) => {
  //   const { id } = req.params;
  //   const { deleteinterest } = req.body;
  //   const user: any = await User.findById({ _id: id });
  //   if (!user) {
  //     return res.status(401).json({ message: "User not find" });
  //   }
  //   user.interests = user.interests.filter(
  //     (el: string) => !deleteinterest.includes(el)
  //   );
  //   await user.save();
  //   return res
  //     .status(200)
  //     .json({ message: "Interests deleted successfully", user });
  // });

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
