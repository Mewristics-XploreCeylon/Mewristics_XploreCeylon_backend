import { Router, Request, Response } from "express";
import UserProfile from "../models/user_profile";
import authenticate from "../auth";
import { UploadedFile } from "express-fileupload";
import fs from "fs";
import path from "path";

const router = Router();

router.get("/", authenticate, async (req: Request, res: Response) => {
  try {
    const userProfile = await UserProfile.findOne({ user: (req as any).user.userId });
    if (!userProfile) {
      const newProfile = new UserProfile({
        user: (req as any).user.userId,
        name: (req as any).user.name,
        profilePicture: "",
      });
      await newProfile.save();
      return res.status(201).json(newProfile);
    }
    res.status(200).json(userProfile);
  } catch (error) {
    res.status(500).send("Error retrieving profile");
  }
});

router.put("/", authenticate, async (req: Request, res: Response) => {
  try {
    if (req.files && Object.keys(req.files).length !== 0) {
      const profilePicture = req.files.profilePicture as UploadedFile;
      const uploadPath = path.join(__dirname, `/images/${(req as any).user.userId}_profile_picture.png`);

      if (fs.existsSync(uploadPath)) {
        fs.unlinkSync(uploadPath);
      }

      profilePicture.mv(uploadPath, async (err) => {
        if (err) {
          return res.status(500).send(err);
        }

        const updateData = { ...req.body, profilePicture: uploadPath };
        const userProfile = await UserProfile.findOneAndUpdate(
          { user: (req as any).user.userId },
          { $set: updateData },
          { new: true }
        );
        if (!userProfile) {
          return res.status(404).send("Profile not found");
        }
        res.status(200).json(userProfile);
      });
    } else {
      const updateData = { ...req.body, profilePicture: "" };
      const userProfile = await UserProfile.findOneAndUpdate(
        { user: (req as any).user.userId },
        { $set: updateData },
        { new: true }
      );
      if (!userProfile) {
        return res.status(404).send("Profile not found");
      }
      res.status(200).json(userProfile);
    }
  } catch (error) {
    res.status(500).send("Error updating profile or profile picture");
  }
});

router.get("/profile-picture", authenticate, async (req: Request, res: Response) => {
  try {
    const userProfile = await UserProfile.findOne({ user: (req as any).user.userId });
    if (!userProfile || !userProfile.profilePicture) {
      return res.status(404).send("Profile picture not found");
    }
    if (!fs.existsSync(userProfile.profilePicture)) {
      return res.status(404).send("Profile picture file not found");
    }
    res.sendFile(userProfile.profilePicture);
  } catch (error) {
    res.status(500).send("Error retrieving profile picture");
  }
});

export default router;
