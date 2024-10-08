import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import connectToMongoDB from "./db";
import jwt from "jsonwebtoken";
import User from "./models/user";
import { UploadedFile } from "express-fileupload";
import authRoutes from "./routes/auth";
import authenticate from "./auth";
import visaAppRoutes from "./routes/visa_app";
import userProfileRoutes from "./routes/user_profile";
import visaRoutes from "./routes/visa";
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001;

const fileUpload = require('express-fileupload');
app.use(fileUpload());

connectToMongoDB();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello hello nama mokkda oyage");
});

app.use("/auth", authRoutes);
app.use("/visa_app", visaAppRoutes);
app.use("/user_profile", userProfileRoutes);
app.use("/visa", visaRoutes);
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
