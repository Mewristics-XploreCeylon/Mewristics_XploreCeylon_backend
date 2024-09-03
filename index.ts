import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import connectToMongoDB from "./db";
import jwt from "jsonwebtoken";
import User from "./models/user";
import { UploadedFile } from "express-fileupload";
import authRoutes from "./routes/auth";
import authenticate from "./auth";

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

app.get("/protected", authenticate, async (req: Request, res: Response) => {
  try {
    const user = await User.findById((req as any).user.userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).send("Error retrieving user");
  }
});

app.post('/upload', function(req, res) {
  let sampleFile;
  let uploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  sampleFile = req.files.sampleFile as UploadedFile;
  uploadPath = __dirname + '/sample.ping';

  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv(uploadPath, function(err) {
    if (err)
      return res.status(500).send(err);

    res.send('File uploaded!');
  });
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
