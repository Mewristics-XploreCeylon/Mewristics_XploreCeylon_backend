import { Router, Request, Response } from "express";
import User from "../models/user";
import authenticate from "../auth";
import VisaApplication from "../models/visa_app";
import { UploadedFile } from "express-fileupload";
import fs from "fs";

const router = Router();

router.post("/", authenticate, async (req: Request, res: Response) => {
  let user: any
  try {
    user = await User.findById((req as any).user.userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).send("Error retrieving user");
  }

  user = user!

  let visaApp = await VisaApplication.findOne({ user: user._id });
  
  const visaAppData = Object.fromEntries(
    Object.entries(req.body).filter(([_, v]) => v != null)
  );

  if (req.files) {
    if (req.files.passportImage) {
      let passportImage = req.files.passportImage as UploadedFile
      const uploadPath = __dirname + `/images/${user._id}_passport_image.png`;
      if (fs.existsSync(uploadPath)) {
        fs.unlinkSync(uploadPath);
      }
      passportImage.mv(uploadPath, function(err: any) {
        if (err)
          return res.status(500).send("Failed to save passport image: " + err);
      });
      visaAppData.passportImage = uploadPath;
    }
    if (req.files.fingerprint) {
      let fingerprint = req.files.fingerprint as UploadedFile
      const uploadPath = __dirname + `/images/${user._id}_fingerprint.png`;
      if (fs.existsSync(uploadPath)) {
        fs.unlinkSync(uploadPath);
      }
      fingerprint.mv(uploadPath, function(err: any) {
        if (err)
          return res.status(500).send("Failed to save fingerprint: " + err);
      });
      visaAppData.fingerprint = uploadPath;
    }
  }

  if (!visaApp) {
    visaApp = new VisaApplication({ ...visaAppData, user: user._id });
    await visaApp.save();
    res.status(201).json(visaApp);
  } else {
    visaApp = await VisaApplication.findOneAndUpdate({ user: user._id }, visaAppData, { new: true });
    res.status(200).json(visaApp);
  }
});

router.get("/", authenticate, async (req: Request, res: Response) => {
  let user: any
  try {
    user = await User.findById((req as any).user.userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
  } catch (error) {
    res.status(500).send("Error retrieving user");
  }

  user = user!

  let visaApp = await VisaApplication.findOne({ user: user._id });

  if (!visaApp) {
    visaApp = await VisaApplication.create({ user: user._id });
  }

  res.status(200).json(visaApp);
});

router.get("/images", async (req: Request, res: Response) => {
  const imagePath = req.body.imagePath
  if (!imagePath) {
    return res.status(400).send("Image path is required");
  }
  if (!fs.existsSync(imagePath)) {
    return res.status(404).send("Image not found");
  }
  res.sendFile(imagePath);
})

export default router;